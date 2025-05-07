import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

@ApiSchema({ name: 'ProductGetDto' })
export class ProductGet {
  @ApiProperty({
    description: 'Product Name',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Product Name',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'Product Category',
    type: [String],
    required: false,
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Category should not be empty' })
  category: string[] | string;

  @ApiProperty({
    description: 'Product SKU',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  sku: string;

  @ApiProperty({
    description: 'Product Stock',
    type: Number,
    required: false,
  })
  @IsString()
  @IsOptional()
  stock: number;

  @ApiProperty({
    description: 'Product WholeSaler',
    type: String,
    required: false,
  })
  @IsString()
  @IsOptional()
  wholeSaler: string;

  @ApiProperty({
    description: 'Product IsVisible',
    type: Boolean,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isVisible: boolean;
}
