import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductoService } from './product.service';
import { ProductoController } from './product.controller';
import { AuthGuard } from 'src/guards/auth.guard';
import { SupabaseService } from 'src/extraServices/supabase.service';
import { UserModule } from 'src/user/user.module';
import { RolesGuard } from 'src/guards/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), UserModule],
  controllers: [ProductoController],
  providers: [ProductoService, AuthGuard, SupabaseService, RolesGuard],
})
export class ProductoModule {}
