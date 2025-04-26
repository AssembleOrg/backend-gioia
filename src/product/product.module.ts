import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductoService } from './product.service';
import { ProductoController } from './product.controller';
import { AuthGuard } from 'src/guards/auth.guard';
import { SupabaseService } from 'src/extraServices/supabase.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductoController],
  providers: [ProductoService, AuthGuard, SupabaseService],
})
export class ProductoModule {}
