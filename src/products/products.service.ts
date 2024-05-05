import { Inject, Injectable } from '@nestjs/common';
import {
  ProductRequestDto,
  CreateProductRequestDto,
} from './dtos/product.request.dto';
import { ProductReponseDto } from './dtos/product.response.dto';
import {
  ProductSchemaDocument,
  ProductSchemaClass,
} from 'src/entities/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilesMinioService } from 'src/minio/files.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly productModel: Model<ProductSchemaDocument>,
    private fileService: FilesMinioService,
  ) {}

  async getProducts(request: ProductRequestDto): Promise<ProductReponseDto[]> {
    const { perPage, page, categoryId } = request;
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

  async createProduct(
    request: CreateProductRequestDto,
    images: Express.Multer.File[],
  ) {
    const urls: string[] = [];

    for (const image of images) {
      const url = await this.fileService.create(image, 'products');
      urls.push(url);
    }

    await this.productModel.create({});

    console.log(
      '🚀 ~ file: products.service.ts:56 ~ ProductsService ~ urls ~ urls:',
      request,
    );

    return;
  }
}
