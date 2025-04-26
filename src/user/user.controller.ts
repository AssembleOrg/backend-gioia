import { Body, Controller, Logger, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRegister } from './dto/userRegister.dto';
import { UserLogin } from './dto/userLogin.dto';

@Controller('user')
export class UserController {
  protected logger = new Logger('UserController');

  constructor(private readonly userService: UserService) {}

  @Post('/register')
  async register(@Body() user: UserRegister) {
    return this.userService.register(user);
  }

  @Post('/login')
  async login(@Body() user: UserLogin) {
    return this.userService.login(user);
  }
}
