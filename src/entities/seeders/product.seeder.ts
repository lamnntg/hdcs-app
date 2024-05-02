import { Injectable } from '@nestjs/common';
import {
  ProductSchemaDocument,
  ProductSchemaClass,
  ProductStatus,
} from '../product.schema';

import {
  ProductSkuSchemaClass,
  ProductSkuSchemaDocument,
} from '../product_sku.schema';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ProductSeeder {
  constructor(
    @InjectModel(ProductSchemaClass.name)
    private readonly ProductModel: Model<ProductSchemaDocument>,
    @InjectModel(ProductSkuSchemaClass.name)
    private readonly ProductSkuModel: Model<ProductSkuSchemaDocument>,
  ) {
    this.run();
  }

  productData = [
    {
      _id: '615f5e0c7c482f32045b57f1', // ObjectId của sản phẩm
      name: 'Laptop Dell XPS 13',
      category: '615f5e0c7c482f32045b57f8', // ObjectId của danh mục Laptop
      slug: 'laptop-dell-xps-13',
      images: ['laptop1.jpg', 'laptop2.jpg'],
      description:
        'The Dell XPS 13 is a powerful and portable laptop with a stunning display.',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      _id: '615f5e0c7c482f32045b57f2', // ObjectId của sản phẩm
      name: 'iPhone 13 Pro',
      category: '615f5e0c7c482f32045b57f8', // ObjectId của danh mục Laptop
      slug: 'iphone-13-pro',
      images: ['iphone1.jpg', 'iphone2.jpg'],
      description:
        "The iPhone 13 Pro is Apple's latest flagship smartphone with advanced features and performance.",
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      _id: '615f5e0c7c482f32045b57f3', // ObjectId của sản phẩm
      name: 'Sony PlayStation 5',
      category: '615f5e0c7c482f32045b57f8', // ObjectId của danh mục Laptop
      slug: 'playstation-5',
      images: ['ps5_1.jpg', 'ps5_2.jpg'],
      description:
        'The Sony PlayStation 5 is the latest gaming console with high-performance hardware and stunning graphics.',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      _id: '615f5e0c7c482f32045b57f4', // ObjectId của sản phẩm
      name: 'Canon EOS R5',
      category: '615f5e0c7c482f32045b57f8', // ObjectId của danh mục Laptop
      slug: 'canon-eos-r5',
      images: ['eos_r5_1.jpg', 'eos_r5_2.jpg'],
      description:
        'The Canon EOS R5 is a professional mirrorless camera with high-resolution imaging and 8K video recording.',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      _id: '615f5e0c7c482f32045b57f5', // ObjectId của sản phẩm
      name: 'MacBook Pro',
      category: '615f5e0c7c482f32045b57f8', // ObjectId của danh mục Laptop
      slug: 'macbook-pro',
      images: ['macbook1.jpg', 'macbook2.jpg'],
      description:
        'The MacBook Pro is a premium laptop with powerful performance and a sleek design.',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      _id: '615f5e0c7c482f32045b57f6', // ObjectId của sản phẩm
      name: 'Google Pixel 6',
      category: '615f5e0c7c482f32045b57f8', // ObjectId của danh mục Laptop
      slug: 'google-pixel-6',
      images: ['pixel6_1.jpg', 'pixel6_2.jpg'],
      description:
        'The Google Pixel 6 is a flagship smartphone with a powerful camera and stock Android experience.',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      _id: '615f5e0c7c482f32045b57f7', // ObjectId của sản phẩm
      name: 'Fujifilm X-T4',
      category: '615f5e0c7c482f32045b57f8', // ObjectId của danh mục Laptop
      slug: 'fujifilm-x-t4',
      images: ['fujifilm_xt4_1.jpg', 'fujifilm_xt4_2.jpg'],
      description:
        'The Fujifilm X-T4 is a mirrorless camera with advanced features and excellent image quality.',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  productSkuData = [
    {
      code: 'SKU001',
      product: '615f5e0c7c482f32045b57f1', // Tham chiếu đến sản phẩm Lgaptop Dell XPS 13
      name: 'Laptop Dell XPS 13 - Core i7, 16GB RAM, 512GB SSD',
      images: ['sku1_1.jpg', 'sku1_2.jpg'],
      description:
        'The Dell XPS 13 - Core i7 SKU comes with a powerful processor, ample RAM, and a spacious SSD for fast performance.',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      code: 'SKU002',
      product: '615f5e0c7c482f32045b57f2', // Tham chiếu đến sản phẩm iPhone 13 Pro
      name: 'iPhone 13 Pro - 256GB, Graphite',
      images: ['sku2_1.jpg', 'sku2_2.jpg'],
      description:
        'The iPhone 13 Pro - 256GB, Graphite SKU features ample storage and a sleek graphite finish.',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      code: 'SKU003',
      product: '615f5e0c7c482f32045b57f3', // Tham chiếu đến sản phẩm Sony PlayStation 5
      name: 'Sony PlayStation 5 - Standard Edition',
      images: ['sku3_1.jpg', 'sku3_2.jpg'],
      description:
        'The Sony PlayStation 5 - Standard Edition SKU includes the console and a controller.',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      code: 'SKU004',
      product: '615f5e0c7c482f32045b57f4', // Tham chiếu đến sản phẩm Canon EOS R5
      name: 'Canon EOS R5 - Body Only',
      images: ['sku4_1.jpg', 'sku4_2.jpg'],
      description:
        'The Canon EOS R5 - Body Only SKU includes only the camera body without a lens.',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      code: 'SKU005',
      product: '615f5e0c7c482f32045b57f5', // Tham chiếu đến sản phẩm MacBook Pro
      name: 'MacBook Pro - 13-inch, M1 Chip, 512GB SSD',
      images: ['sku5_1.jpg', 'sku5_2.jpg'],
      description:
        'The MacBook Pro - 13-inch, M1 Chip SKU offers powerful performance and a high-resolution Retina display.',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      code: 'SKU006',
      product: '615f5e0c7c482f32045b57f6', // Tham chiếu đến sản phẩm Google Pixel 6
      name: 'Google Pixel 6 - 128GB, Just Black',
      images: ['sku6_1.jpg', 'sku6_2.jpg'],
      description:
        'The Google Pixel 6 - 128GB, Just Black SKU features a sleek design and advanced camera capabilities.',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
    {
      code: 'SKU007',
      product: '615f5e0c7c482f32045b57f7', // Tham chiếu đến sản phẩm Fujifilm X-T4
      name: 'Fujifilm X-T4 - Silver, 18-55mm Lens Kit',
      images: ['sku7_1.jpg', 'sku7_2.jpg'],
      description:
        'The Fujifilm X-T4 - Silver SKU comes with an 18-55mm lens kit, perfect for photography enthusiasts.',
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    },
  ];

  async run(): Promise<void> {
    const countUser = await this.ProductModel.estimatedDocumentCount().exec();

    if (!countUser) {
      await this.ProductModel.create(this.productData);
      await this.ProductSkuModel.create(this.productSkuData);
    }
  }
}
