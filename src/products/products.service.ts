import { Injectable } from '@nestjs/common';
import { ProductRequestDto } from './dtos/product.request.dto';
import { ProductReponseDto } from './dtos/product.response.dto';
import {
  ProductSchemaDocument,
  ProductSchemaClass,
} from 'src/entities/product.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly productModel: Model<ProductSchemaDocument>,
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
}
