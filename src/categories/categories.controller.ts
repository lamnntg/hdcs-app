import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { CategoriesService } from './categories.service';
import { CategoriesReponseDto } from './dtos/category.request.dto';

@ApiBearerAuth()
@Roles(RoleEnum.user)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('categories')
@Controller({
  path: 'categories',
  version: '1',
})
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getCategories(): Promise<CategoriesReponseDto[]> {
    return await this.categoriesService.getCategories();
  }
}
