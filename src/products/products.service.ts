import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ProductRequestDto,
  CreateProductRequestDto,
} from './dtos/product.request.dto';
import {
  ProductListResponseDto,
  ProductReponseDto,
} from './dtos/product.response.dto';
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
import { CategoriesService } from 'src/categories/categories.service';

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
    private categoryService: CategoriesService,
  ) {}

  /**
   * getProducts
   *
   * @param request
   * @returns
   */
  async getProducts(
    request: ProductRequestDto,
  ): Promise<ProductListResponseDto> {
    const {
      per_page: perPage,
      page,
      category_id: categoryId,
      category_slug: categorySlug,
      product_name: productName,
    } = request;

    // handle query
    let query = {};
    if (categoryId) {
      const categoryIds =
        await this.categoryService.getChildCategories(categoryId);

      categoryIds.push(categoryId);
      query = { category: { $in: categoryIds } };
    } else if (categorySlug) {
      const category = await this.categoryModel
        .findOne({ slug: categorySlug })
        .lean();

      if (category) {
        const categoryIds = await this.categoryService.getChildCategories(
          category?._id?.toString(),
        );
        categoryIds.push(category?._id?.toString());

        if (categoryIds) {
          query = { category: { $in: categoryIds } };
        }
      }
    }

    // query search product
    if (productName) {
      // Case-insensitive search for productName
      query = { ...query, name: { $regex: productName, $options: 'i' } };
    }

    // Find total count of documents
    const totalCount = await this.productModel.countDocuments(query);

    const skip = (page - 1) * perPage;
    const products = await this.productModel
      .find(query)
      .sort({ createdAt: 'desc' })
      .populate('category')
      .skip(skip)
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

    return {
      total: totalCount as number,
      per_page: perPage as number,
      current_page: page as number,
      last_page: Math.ceil(totalCount / perPage),
      data: transformedProducts,
    };
  }

  /**
   * getProducts
   *
   * @param request
   * @returns
   */
  async getProductDetail(productQuery: string): Promise<any> {
    let query;

    if (!productQuery.includes('-')) {
      // Assuming productQuery is the productId
      query = { _id: productQuery };
    } else {
      // Assuming productQuery is the slug
      query = { slug: productQuery };
    }

    const product = await this.productModel.findOne(query).populate('category');

    if (!product) {
      // Handle product not found
      throw new Error('Product not found');
    }

    const productSkus = await this.productSkuModel.find({
      product: product._id,
    });

    const productImages = await this.fileService.getMutilsPresignedUrl(
      product.images,
    );

    const skus = await Promise.all(
      productSkus.map(async (sku) => {
        const skuImages = await this.fileService.getMutilsPresignedUrl(
          sku.images,
        );

        return {
          _id: sku._id.toString(),
          code: sku.code,
          name: sku.name,
          images: skuImages,
          description: sku.description,
          price: sku.price,
        };
      }),
    );

    return {
      _id: product._id.toString(),
      category: {
        _id: product.category._id.toString(), //
        name: product.category.name, //
        slug: product.category.slug, //
        description: product.category.description, //
      },
      skus: skus,
      name: product.name,
      images: productImages,
      description: product.description,
      slug: product.slug,
      status: product.status,
    };
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
        const collectImageName = `skus[${key}][sku_images]`;

        const skuImages = await this.uploadImagesByFieldsName(
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
