import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../roles/roles.guard';
import { ProductsService } from './products.service';
import { ProductRequestDto } from './dtos/product.request.dto';
import { ProductReponseDto } from './dtos/product.response.dto';

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
}
