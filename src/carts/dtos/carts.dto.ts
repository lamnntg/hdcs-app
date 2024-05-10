import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CartReponseDto {
  _id: string;
  parent: string | null;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  children: any;
}

export class CreateCartRequestDto {
  cart_items: CartItemDto[];
}

export class CartItemDto {
  @ApiProperty()
  @IsNotEmpty()
  sku_id: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number; //
}
