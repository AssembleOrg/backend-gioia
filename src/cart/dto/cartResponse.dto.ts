import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { CartItemResponse } from './cartItemResponse.dto';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

@ApiSchema({
  name: 'CartResponseDto',
})
export class CartResponse {
  @ApiProperty({
    description: 'Cart Id',
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Cart Created At',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Cart Updated At',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'Cart User Id',
  })
  @IsString()
  userId: string;

  @ApiProperty({
    description: 'Cart Items',
  })
  @IsArray()
  items: CartItemResponse[];
}
