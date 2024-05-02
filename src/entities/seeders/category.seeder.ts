import { Injectable } from '@nestjs/common';
import {
  CategorySchemaDocument,
  CategorySchemaClass,
} from '../category.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CategorySeeder {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly categoryModel: Model<CategorySchemaDocument>,
  ) {
    this.run();
  }

  categoryData = [
    {
      parent: null,
      name: 'Electronics',
      slug: 'electronics',
      description: 'Category for electronic products',
    },
    {
      parent: '615f5e0c7c482f32045b57f1',
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Category for smartphones',
    },
    {
      parent: '615f5e0c7c482f32045b57f1',
      name: 'Laptops',
      slug: 'laptops',
      description: 'Category for laptops',
    },
    {
      parent: '615f5e0c7c482f32045b57f1',
      name: 'Tablets',
      slug: 'tablets',
      description: 'Category for tablets',
    },
    {
      parent: '615f5e0c7c482f32045b57f1',
      name: 'Accessories',
      slug: 'accessories',
      description: 'Category for accessories',
    },
    {
      parent: null,
      name: 'Clothing',
      slug: 'clothing',
      description: 'Category for clothing items',
    },
    {
      parent: '615f5e0c7c482f32045b57f7',
      name: "Men's Clothing",
      slug: 'mens-clothing',
      description: "Category for men's clothing items",
    },
    {
      parent: '615f5e0c7c482f32045b57f7',
      name: "Women's Clothing",
      slug: 'womens-clothing',
      description: "Category for women's clothing items",
    },
    {
      parent: '615f5e0c7c482f32045b57f7',
      name: "Kids' Clothing",
      slug: 'kids-clothing',
      description: "Category for kids' clothing items",
    },
    // Thêm các mẫu dữ liệu khác nếu cần
  ];

  async run(): Promise<void> {
    const countUser = await this.categoryModel.estimatedDocumentCount().exec();

    if (!countUser) {
      await this.categoryModel.create(this.categoryData);
    }
  }
}
