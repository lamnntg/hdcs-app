import { Inject, Injectable, Request } from '@nestjs/common';
import {
  CategorySchemaDocument,
  CategorySchemaClass,
} from '../entities/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CartSchemaClass, CartSchemaDocument } from 'src/entities/cart.schema';
import { CartItemDto } from './dtos/carts.dto';
import {
  CartDetailSchemaClass,
  CartDetailSchemaDocument,
} from 'src/entities/cart_detail.schema';
import {
  ProductSkuSchemaClass,
  ProductSkuSchemaDocument,
} from 'src/entities/product_sku.schema';

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
      const productSku = await this.productSkuModel.findById(item.productSku);

      const cartItem = {
        _id: item._id.toString(),
        quantity: item.quantity,
        price: item.price,
        product: productSku,
      };

      cartItems.push(cartItem);
    }

    return {
      _id: cart._id,
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
      const cartDetail = await this.cartDetailModel.create({
        cart: cart._id,
        productSku: cartItem.sku_id,
        quantity: cartItem.quantity,
        price: productSku.price,
      });
    }

    return;
  }
}
