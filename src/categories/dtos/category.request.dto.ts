export class CategoriesReponseDto {
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
