import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { SupabaseService } from 'src/extraServices/supabase.service';
import { Cart } from 'src/cart/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Cart])],
  controllers: [UserController],
  providers: [UserService, SupabaseService],
  exports: [UserService],
})
export class UserModule {}
