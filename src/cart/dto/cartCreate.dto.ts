import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

@ApiSchema({
  name: 'CartCreateDto',
})
export class CartCreate {
  @ApiProperty({
    description: 'Cart User Id',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;
}
