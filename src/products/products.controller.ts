import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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

  @Get('/:productId')
  @HttpCode(HttpStatus.OK)
  async getProductDetail(@Param('productId') productId: string): Promise<any> {
    return await this.productService.getProductDetail(productId);
  }

  @Post('/create')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(AnyFilesInterceptor())
  @HttpCode(HttpStatus.OK)
  async createProduct(
    @Body() request: CreateProductRequestDto,
    @UploadedFiles() images: Express.Multer.File[], // Use UploadedFiles to handle multiple files
  ): Promise<void> {
    // Pass the product data and images to the service method to create the product
    return await this.productService.createProduct(request, images);
  }
}
