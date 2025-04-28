import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ApiSchema({
  name: 'CartCreateDto',
})
export class CartCreate {
  @ApiProperty({
    description: 'Cart User Id',
  })
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
