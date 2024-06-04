import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Request,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { AuthGuard } from '@nestjs/passport';

import { RolesGuard } from '../roles/roles.guard';
import { OrdersService } from './orders.service';
import {
  CreateOrderRequestDto,
  OrderQueryRequestDto,
} from './dtos/order.request.dto';

@ApiBearerAuth()
@Roles(RoleEnum.user, RoleEnum.admin)
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
  async createOrder(
    @Request() request,
    @Body() params: CreateOrderRequestDto,
  ): Promise<any> {
    return await this.ordersService.createOrder(request.user._id, params);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getOrders(@Request() request): Promise<any> {
    return await this.ordersService.getOrders(request.user._id);
  }

  @SerializeOptions({
    groups: ['admin'],
  })
  @Get('/all')
  @HttpCode(HttpStatus.OK)
  async getAllOrder(@Query() request: OrderQueryRequestDto): Promise<any> {
    return await this.ordersService.getOrders(request);
  }
}
