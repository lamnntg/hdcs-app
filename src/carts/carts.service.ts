import {
  BadRequestException,
  Inject,
  Injectable,
  Request,
} from '@nestjs/common';
import {
  CategorySchemaDocument,
  CategorySchemaClass,
} from '../entities/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CartSchemaClass, CartSchemaDocument } from 'src/entities/cart.schema';
import { CartItemDto, UpdateCartItemDto } from './dtos/carts.dto';
import {
  CartDetailSchemaClass,
  CartDetailSchemaDocument,
} from 'src/entities/cart_detail.schema';
import {
  ProductSkuSchemaClass,
  ProductSkuSchemaDocument,
} from 'src/entities/product_sku.schema';
import { FilesMinioService } from 'src/minio/files.service';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly categoryModel: Model<CategorySchemaDocument>,
    @InjectModel(CartSchemaClass.name)
    private readonly cartModel: Model<CartSchemaDocument>,
    @InjectModel(CartDetailSchemaClass.name)
    private readonly cartDetailModel: Model<CartDetailSchemaDocument>,
    @InjectModel(ProductSkuSchemaClass.name)
    private readonly productSkuModel: Model<ProductSkuSchemaDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private fileService: FilesMinioService,
  ) {}

  /**
   * get cart
   * @param userId
   * @returns
   */
  async getCarts(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      return [];
    }

    const cartDetails = await this.cartDetailModel
      .find({ cart: cart._id })
      .lean();

    // handle data cart detail\
    const cartItems: any = [];
    for (const item of cartDetails) {
      const productSku = await this.productSkuModel
        .findById(item.productSku)
        .lean();

      const images = await this.fileService.getMutilsPresignedUrl(
        productSku?.images || [],
      );

      const cartItem = {
        _id: item._id.toString(),
        quantity: item.quantity,
        price: item.price,
        product: {
          sku_id: productSku?._id.toString(),
          product_id: productSku?.product.toString(),
          name: productSku?.name,
          images: images,
          description: productSku?.description,
          code: productSku?.code,
        },
      };

      cartItems.push(cartItem);
    }

    return {
      _id: cart._id.toString(),
      items: cartItems,
    };
  }

  /**
   * add to cart
   *
   * @param userId
   * @param cartItem
   * @returns
   */
  async addToCart(userId: string, cartItem: CartItemDto): Promise<any> {
    let cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      cart = await this.cartModel.create({ user: userId, total: 0 });
    }

    const productSku = await this.productSkuModel.findOne({
      _id: cartItem.sku_id,
    });

    if (productSku) {
      const cartDetail = await this.cartDetailModel
        .findOne({
          productSku: productSku._id,
          cart: cart._id,
        })
        .lean();

      if (!cartDetail) {
        await this.cartDetailModel.create({
          cart: cart._id,
          productSku: cartItem.sku_id,
          quantity: cartItem.quantity,
          price: productSku.price,
        });

        return;
      }

      await this.cartDetailModel.updateOne(
        {
          productSku: productSku._id,
          cart: cart._id,
        },
        {
          quantity: cartItem.quantity + cartDetail.quantity,
        },
      );
      return;
    }

    throw new BadRequestException();
  }

  /**
   * delete cart
   * @param userId
   */
  async deleteCart(userId: string, cartDetailId: string) {
    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      return;
    }

    if (cartDetailId == 'all') {
      await this.cartDetailModel.deleteMany({ cart: cart._id });
      await this.cartModel.deleteMany({ user: userId });
    } else {
      await this.cartDetailModel.deleteOne({ _id: cartDetailId });
    }

    return;
  }

  /**
   * update quantity cart
   * @param userId
   */
  async updateCart(userId: string, params: UpdateCartItemDto) {
    const cart = await this.cartModel.findOne({ user: userId });

    if (!cart) {
      throw new BadRequestException('Cart is not available');
    }
    await this.cartDetailModel.findOneAndUpdate(
      { productSku: params.sku_id },
      { quantity: params.quantity },
    );

    return;
  }
}
