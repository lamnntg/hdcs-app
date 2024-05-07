import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ProductRequestDto,
  CreateProductRequestDto,
} from './dtos/product.request.dto';
import { ProductReponseDto } from './dtos/product.response.dto';
import {
  ProductSchemaDocument,
  ProductSchemaClass,
  ProductStatus,
} from 'src/entities/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { FilesMinioService } from 'src/minio/files.service';
import { generate_slug } from '../utils/string.helper';
import {
  CategorySchemaClass,
  CategorySchemaDocument,
} from 'src/entities/category.schema';
import {
  ProductSkuSchemaClass,
  ProductSkuSchemaDocument,
} from 'src/entities/product_sku.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly productModel: Model<ProductSchemaDocument>,
    @InjectModel(ProductSkuSchemaClass.name)
    private readonly productSkuModel: Model<ProductSkuSchemaDocument>,
    @InjectModel(CategorySchemaClass.name)
    private readonly categoryModel: Model<CategorySchemaDocument>,
    private fileService: FilesMinioService,
  ) {}

  async getProducts(request: ProductRequestDto): Promise<ProductReponseDto[]> {
    const { per_page: perPage, page, category_id: categoryId } = request;
    // handle query
    let query = {};
    if (categoryId) {
      query = { category: categoryId };
    }

    const products = await this.productModel
      .find(query)
      .populate('category')
      .skip(page)
      .limit(perPage)
      .lean();

    // transformer products
    // Use Promise.all to asynchronously process each product
    const transformedProducts = await Promise.all(
      products.map(async (product) => {
        product._id = product._id.toString();
        product.category._id = product.category._id.toString() || '';
        product.images = await this.fileService.getMutilsPresignedUrl(
          product.images,
        );

        return product;
      }),
    );

    return transformedProducts;
  }

  /**
   * create product
   * @param request
   * @param images
   * @returns
   */
  async createProduct(
    request: CreateProductRequestDto,
    images: Express.Multer.File[],
  ) {
    let urls: string[] = [];

    // check category is valid
    const category = await this.categoryModel.find({
      _id: request.category_id,
    });

    if (!category) {
      throw new BadRequestException();
    }

    const product = await this.productModel.create({
      category: new mongoose.Types.ObjectId(request.category_id),
      name: request.name,
      images: urls,
      description: request.description,
      slug: generate_slug(request.name),
      status: ProductStatus.active,
      type: 'new',
    });

    // handle upload image product
    urls = await this.uploadImagesByFieldsName(images, 'images', product._id);

    // update image url
    await this.productModel.findOneAndUpdate(
      { _id: product._id },
      {
        images: urls,
      },
      { new: true },
    );

    // create sku of product
    if (request.skus) {
      for (const [key, sku] of Object.entries(request.skus)) {
        const collectImageName = `sku[${key}][sku_images]`;

        const skuImages = this.uploadImagesByFieldsName(
          images,
          collectImageName,
          product._id,
        );

        await this.productSkuModel.create({
          code: `${sku.name.substring(0, 3)}${Date.now()}`.toUpperCase(),
          product: product._id,
          images: skuImages,
          description: sku.description,
          price: sku.price,
          name: sku.name,
        });
      }
    }

    return;
  }

  /**
   * handle upload images
   *
   * @param images
   * @param fieldName
   * @param productId
   * @returns
   */
  private async uploadImagesByFieldsName(
    images: Express.Multer.File[],
    fieldName: string,
    productId: string,
  ) {
    const urls: string[] = [];

    // handle upload image product
    for (const image of images) {
      if (image.fieldname == fieldName) {
        const url = await this.fileService.create(
          image,
          `products/${productId}`,
        );
        urls.push(url);
      }
    }

    return urls;
  }
}
