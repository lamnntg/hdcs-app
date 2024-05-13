import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty } from 'class-validator';

export class ProductRequestDto {
  @Allow()
  per_page: number = 10;

  @Allow()
  page: number = 1;

  @Allow()
  category_id?: string;

  @Allow()
  category_slug?: string;

  @Allow()
  product_name?: string;
}

export class CreateProductRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  category_id: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  skus?: CreateProductSkuRequestDto[];
}

export class CreateProductSkuRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  price: number;
}
