import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import supabaseConfig from './config/supabase.config';
import serverConfig from './config/server.config';
import postgresDbConfig from './config/postgresDb.config';
import digitalOceanConfig from './config/digitalOcean.config';
import * as path from 'path';
import { SupabaseService } from './extraServices/supabase.service';
import { AdminSettingsModule } from './admin-settings/admin-settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        supabaseConfig,
        serverConfig,
        postgresDbConfig,
        digitalOceanConfig,
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('postgres.host'),
        port: configService.get<number>('postgres.port'),
        username: configService.get<string>('postgres.username'),
        password: configService.get<string>('postgres.password'),
        database: configService.get<string>('postgres.database'),
        entities: [
          path.join(__dirname, 'product', '**', '*.entity{.ts,.js}'),
          path.join(__dirname, 'user', '**', '*.entity{.ts,.js}'),
          path.join(__dirname, 'cart', '**', '*.entity{.ts,.js}'),
          path.join(__dirname, '..', 'cartItem', '**', '*.entity{.ts,.js}'),
        ],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ProductoModule,
    UserModule,
    CartModule,
    AdminSettingsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SupabaseService],
})
export class AppModule {
  constructor(private readonly configService: ConfigService) {}
  onModuleInit() {
    console.log('AppModule initialized');
  }
}
