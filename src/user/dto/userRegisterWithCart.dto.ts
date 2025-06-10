import { ApiProperty, ApiSchema, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Cart } from 'src/cart/cart.entity';

@ApiSchema({ name: 'UserRegisterWithCartDto' })
export class UserRegisterWithCartDto {
  @ApiProperty({
    description: 'User Email',
    type: String,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User Password',
    type: String,
  })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'User Full Name',
    type: String,
  })
  @IsNotEmpty({ message: 'Full Name should not be empty' })
  fullName: string;

  @ApiProperty({
    description: 'User Cart',
    type: PartialType(Cart),
  })
  @IsNotEmpty({ message: 'Cart should not be empty' })
  cart: Partial<Cart>;
}
