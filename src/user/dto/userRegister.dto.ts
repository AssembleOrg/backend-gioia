import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@ApiSchema({ name: 'UserRegisterDto' })
export class UserRegister {
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
}
