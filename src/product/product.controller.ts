import {
  Controller,
  Get,
  InternalServerErrorException,
  Logger,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async getAllProducts() {
    return this.productoService.getAllProducts();
  }

  @Get('/filter')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [ProductResponse] })
  @ApiQuery({
    name: 'name',
    type: String,
    required: false,
    description: 'Product Name',
  })
  @ApiQuery({
    name: 'category',
    type: [String],
    required: false,
    description: 'Product Category (can be repeated)',
  })
  @ApiQuery({
    name: 'sku',
    type: String,
    required: false,
    description: 'Product SKU',
  })
  @ApiQuery({
    name: 'stock',
    type: Number,
    required: false,
    description: 'Product Stock',
  })
  @ApiQuery({
    name: 'wholeSaler',
    type: String,
    required: false,
    description: 'Product WholeSaler',
  })
  @ApiQuery({
    name: 'isVisible',
    type: Boolean,
    required: false,
    description: 'Product IsVisible',
  })
  @ApiExtraModels(ProductGet)
  async getFilteredProducts(
    @Query(ValidationPipe) query: ProductGet,
  ): Promise<ProductResponse[]> {
    const filteredProducts = await this.productoService.getFilteredProducts({
      ...query,
      category: query.category ? [].concat(query.category) : undefined,
    });
    return filteredProducts.length > 0
      ? filteredProducts.map((product) =>
          plainToInstance(ProductResponse, product),
        )
      : [];
  }
}
