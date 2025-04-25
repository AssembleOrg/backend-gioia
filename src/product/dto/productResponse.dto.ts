import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNumber, IsString } from 'class-validator';

@ApiSchema({ name: 'ProductResponse' })
export class ProductResponse {
  @ApiProperty({
    description: 'Product ID',
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Product Name',
    type: String,
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Product Category',
    type: String,
  })
  @IsArray()
  category: Array<string>;

  @ApiProperty({
    description: 'Product Price',
    type: Number,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'Product Description',
    type: String,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Product Image Url',
    type: String,
  })
  @IsString()
  imageUrl: string;

  @ApiProperty({
    description: 'Product SKU',
    type: String,
  })
  @IsString()
  sku: string;

  @ApiProperty({
    description: 'Product Presentation',
    type: String,
  })
  @IsString()
  presentation: string;

  @ApiProperty({
    description: 'Product Application',
    type: String,
  })
  @IsString()
  aplication: string;

  @ApiProperty({
    description: 'Product Stock',
    type: Number,
  })
  @IsString()
  stock: number;

  @ApiProperty({
    description: 'Product WholeSaler',
    type: String,
  })
  @IsString()
  wholeSaler: string;

  @ApiProperty({
    description: 'Product IsVisible',
    type: Boolean,
  })
  @IsBoolean()
  isVisible: boolean;
}
