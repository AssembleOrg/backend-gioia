import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegister } from './dto/userRegister.dto';
import { UserLogin } from './dto/userLogin.dto';
import { UserRegisterWithCartDto } from './dto/userRegisterWithCart.dto';

@Controller('user')
export class UserController {
  protected logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() user: UserRegister) {
    return this.userService.register(user);
  }

  @Post('/register-with-cart')
  async registerWithCart(@Body() user: UserRegisterWithCartDto) {
    return this.userService.registerWithCart(user);
  }

  @Post('/login')
  async login(@Body() user: UserLogin) {
    return this.userService.login(user);
  }

  @Get('/:id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }
}
