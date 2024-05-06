import { BadRequestException, Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly productModel: Model<ProductSchemaDocument>,
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
    return products.map((product) => {
      product._id = product._id.toString();
      product.category._id = product.category._id.toString() || '';

      return product;
    });
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
    console.log(
      '🚀 ~ file: products.service.ts:66 ~ ProductsService ~ request:',
      images,
    );
    const urls: string[] = [];

    // check category is valid
    const category = await this.categoryModel.find({
      _id: request.category_id,
    });

    if (category) {
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

    for (const image of images) {
      const url = await this.fileService.create(
        image,
        `products/${product._id.toString()}`,
      );
      urls.push(url);
    }

    // update image
    const productData = await this.productModel.findOneAndUpdate(
      { _id: product._id },
      {
        images: urls,
      },
      { new: true },
    );

    console.log(
      '🚀 ~ file: products.service.ts:56 ~ ProductsService ~ urls ~ urls:',
      productData,
    );

    return;
  }
}
