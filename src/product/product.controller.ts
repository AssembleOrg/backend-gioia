import { Controller, Get, Logger, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProductoService } from './product.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProductGet } from './dto/productGet.dto';
import { ProductResponse } from './dto/productResponse.dto';
import { plainToInstance } from 'class-transformer';

@Controller('producto')
@ApiTags('Kansaco - Productos')
export class ProductoController {
  protected logger = new Logger('ProductoController');
  constructor(private readonly productoService: ProductoService) {}

  @Get()
  // @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async getAllProducts() {
    return this.productoService.getAllProducts();
  }

  @Get('/filter')
  // @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'sku', required: false })
  @ApiQuery({ name: 'stock', required: false })
  @ApiQuery({ name: 'wholeSaler', required: false })
  @ApiQuery({ name: 'isVisible', required: false })
  async getFilteredProducts(
    @Query('category') category?: string,
    @Query('name') name?: string,
    @Query('sku') sku?: string,
    @Query('stock') stock?: string,
    @Query('wholeSaler') wholeSaler?: string,
    @Query('isVisible') isVisible?: string,
  ): Promise<ProductResponse[]> {
    try {
      const filters: Partial<Record<keyof ProductGet, string>> = {
        category,
        name,
        sku,
        stock,
        wholeSaler,
        isVisible,
      };
      const filteredProducts =
        await this.productoService.getFilteredProducts(filters);
      return filteredProducts.length > 0
        ? filteredProducts.map((product) =>
            plainToInstance(ProductResponse, product),
          )
        : [];
    } catch (error) {
      this.logger.error(error);
    }
  }
}
