import { Inject, Injectable } from '@nestjs/common';
import {
  CategorySchemaDocument,
  CategorySchemaClass,
} from '../entities/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly categoryModel: Model<CategorySchemaDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getCarts() {
    return;
  }
}
