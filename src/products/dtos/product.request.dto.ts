import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty } from 'class-validator';

export class ProductRequestDto {
  @Allow()
  perPage: number = 10;

  @Allow()
  page: number = 1;

  @Allow()
  categoryId?: string;

  @Allow()
  categorySlug?: string;
}

export class CreateProductRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  sku?: string;
}
