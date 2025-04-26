import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@ApiSchema({ name: 'UserLoginDto' })
export class UserLogin {
  @ApiProperty({
    description: 'User Email',
  })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Mail is not valid' })
  email: string;

  @ApiProperty({
    description: 'User Password',
  })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(8, { message: 'Password should be at least 8 characters long' })
  password: string;
}
