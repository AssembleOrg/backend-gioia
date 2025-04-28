import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cartItem.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { SupabaseService } from 'src/extraServices/supabase.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [CartController],
  providers: [CartService, AuthGuard, SupabaseService],
  imports: [TypeOrmModule.forFeature([Cart, CartItem]), UserModule],
})
export class CartModule {}
