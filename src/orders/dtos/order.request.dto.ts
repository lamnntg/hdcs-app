import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  shipping_address: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  @IsNotEmpty()
  items: OrderItemRequestDto[];
}

export class OrderItemRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  sku_id: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;
}
