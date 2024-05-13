export class ProductListResponseDto {
  total?: number;
  last_page?: number;
  per_page?: number;
  current_page?: number;
  data?: ProductReponseDto[];
}

export class ProductReponseDto {
  _id?: string;
  category?: any;
  name?: string;
  images?: string[];
  description?: string;
  skus?: any;
  slug?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
