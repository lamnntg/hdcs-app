import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../roles/roles.guard';
import { OrdersService } from './orders.service';
import { CreateOrderRequestDto } from './dtos/order.request.dto';

@ApiBearerAuth()
@Roles(RoleEnum.user)
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('Orders')
@Controller({
  path: 'orders',
  version: '1',
})
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  async createCart(
    @Request() request,
    @Body() params: CreateOrderRequestDto,
  ): Promise<any> {
    return await this.ordersService.createCart(request.user._id, params);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getCarts(@Request() request): Promise<any> {
    return await this.ordersService.getOrders(request.user._id);
  }
}
