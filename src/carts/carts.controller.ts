import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { CartsService } from './carts.service';

@ApiBearerAuth()
@Roles(RoleEnum.user)
// @UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('carts')
@Controller({
  path: 'carts',
  version: '1',
})
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async getCarts(): Promise<any> {
    return await this.cartsService.getCarts();
  }
}
