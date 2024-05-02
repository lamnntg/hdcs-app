import { Inject, Injectable } from '@nestjs/common';
import {
  CategorySchemaDocument,
  CategorySchemaClass,
} from '../entities/category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { CategoriesReponseDto } from './dtos/category.request.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly categoryModel: Model<CategorySchemaDocument>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  /**
   *
   * @returns
   */
  async getCategories(): Promise<CategoriesReponseDto[]> {
    let categoryTree = await this.cacheManager.get('category_tree');

    if (categoryTree) {
      return categoryTree as CategoriesReponseDto[];
    }

    let categories = await this.cacheManager.get('categories');

    if (!categories) {
      categories = (await this.categoryModel.find().lean()).map((category) => {
        return {
          ...category,
          _id: category._id.toString(),
          parent: category.parent ? category.parent.toString() : null,
        };
      });
      await this.cacheManager.set('categories', categories);
    }

    categoryTree = await this.buildCategoryTree(categories);
    await this.cacheManager.set('categoryTree', categories);

    return categoryTree as CategoriesReponseDto[];
  }

  /**
   * handleCategories
   * @param categories
   */
  private buildCategoryTree(
    categories: any,
    parentId: ObjectId | null = null,
  ): any[] {
    const filteredCategories = categories.filter((category) => {
      if (parentId) {
        return String(category.parent) === String(parentId);
      } else {
        return category.parent == null;
      }
    });

    return filteredCategories.map((category) => {
      return {
        ...category,
        children: this.buildCategoryTree(categories, category._id),
      };
    });
  }
}
