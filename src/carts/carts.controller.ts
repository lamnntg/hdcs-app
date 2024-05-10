import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { CartsService } from './carts.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/roles/roles.guard';
import { CartItemDto, CreateCartRequestDto } from './dtos/carts.dto';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('carts')
@Controller({
  path: 'carts',
  version: '1',
})
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getCarts(@Request() request): Promise<any> {
    return await this.cartsService.getCarts(request.user.id);
  }

  @Post('/add')
  @HttpCode(HttpStatus.OK)
  async addToCart(
    @Request() request,
    @Body() params: CartItemDto,
  ): Promise<any> {
    return await this.cartsService.addToCart(request.user.id, params);
  }

  @Delete('/delete')
  @HttpCode(HttpStatus.OK)
  async deleteCart(@Request() request): Promise<any> {
    return await this.cartsService.deleteCart(request.user.id);
  }
}
