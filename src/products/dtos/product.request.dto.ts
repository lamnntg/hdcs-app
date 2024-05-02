import { Allow } from 'class-validator';

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
