import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../roles/roles.guard';
import { ProductsService } from './products.service';
import {
  CreateProductRequestDto,
  ProductRequestDto,
} from './dtos/product.request.dto';
import { ProductReponseDto } from './dtos/product.response.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@Roles(RoleEnum.user)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getProducts(
    @Query() request: ProductRequestDto,
  ): Promise<ProductReponseDto[]> {
    return await this.productService.getProducts(request);
  }

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('images', 10)) // Maximum 10 images can be uploaded
  @UseInterceptors(FilesInterceptor('skus.*.sku_images', 10)) // Maximum 10 images per sku can be uploaded
  @HttpCode(HttpStatus.OK)
  async createProduct(
    @Body() request: CreateProductRequestDto,
    @UploadedFiles() images: Express.Multer.File[], // Use UploadedFiles to handle multiple files
    @UploadedFiles() sku_images: { [key: string]: Express.Multer.File[] }, // Use UploadedFiles to handle multiple files for each sku
  ): Promise<void> {
    console.log(
      '🚀 ~ file: products.controller.ts:57 ~ ProductsController ~ skus:',
      sku_images,
    );
    // Pass the product data and images to the service method to create the product
    return await this.productService.createProduct(request, images);
  }
}
