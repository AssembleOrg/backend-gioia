import { Module } from '@nestjs/common';
import { AdminSettingsController } from './admin-settings.controller';
import { AdminSettingsService } from './admin-settings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminSetting } from './admin-setting.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserModule } from 'src/user/user.module';
import { SupabaseService } from 'src/extraServices/supabase.service';

@Module({
  controllers: [AdminSettingsController],
  providers: [AdminSettingsService, AuthGuard, SupabaseService],
  imports: [TypeOrmModule.forFeature([AdminSetting]), UserModule],
})
export class AdminSettingsModule {}
