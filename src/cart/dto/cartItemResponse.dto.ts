import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

@ApiSchema({
  name: 'CartItemResponseDto',
})
export class CartItemResponse {
  @ApiProperty({
    description: 'Cart Item id',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Cart Item Product id',
  })
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'Cart Item Quantity',
  })
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'Cart Id',
  })
  @IsNumber()
  cartId: number;
}
