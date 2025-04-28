import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
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
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/user/user.enum';
import { ProductEdit } from './dto/productEdit.dto';
import { ProductCreate } from './dto/productCreate.dto';

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

  @Get('/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProductResponse })
  async getProduct(@Param('id') id: number): Promise<ProductResponse> {
    const product = await this.productoService.getProduct(id);
    return plainToInstance(ProductResponse, product);
  }

  @Post('/:id/edit')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async editProduct(
    @Param('id') id: number,
    @Body(ValidationPipe) body: ProductEdit,
  ): Promise<ProductResponse> {
    const product = await this.productoService.editProduct(id, body);
    return plainToInstance(ProductResponse, product);
  }

  @Post('/create')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: ProductResponse })
  async createProduct(
    @Body(ValidationPipe) body: ProductCreate,
  ): Promise<ProductResponse> {
    const product = await this.productoService.createProduct(body);
    return plainToInstance(ProductResponse, product);
  }

  @Delete('/:id')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async deleteProduct(@Param('id') id: number): Promise<ProductResponse> {
    const product = await this.productoService.deleteProduct(id);
    return plainToInstance(ProductResponse, product);
  }
}
