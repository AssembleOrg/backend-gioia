import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminSetting } from './admin-setting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AdminSettingsService {
  protected logger = new Logger('AdminSettingsService');
  private cachedMinOrderAmount: number | null = null;

  constructor(
    @InjectRepository(AdminSetting)
    private readonly adminSettingRepository: Repository<AdminSetting>,
  ) {}

  async getMinimumOrderAmount(): Promise<number> {
    // 1) If we have it in cache, return immediately
    if (this.cachedMinOrderAmount !== null) {
      return this.cachedMinOrderAmount;
    }

    // 2) Otherwise load from DB
    try {
      const settings = await this.adminSettingRepository.find();

      if (settings.length === 0) {
        throw new NotFoundException('No settings found');
      }

      // pick the last one
      const last = settings[settings.length - 1].minimumOrderAmount;
      this.cachedMinOrderAmount = last; // store in cache
      return last;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error getting minimum order amount',
      );
    }
  }

  async setMinimumOrderAmount(
    minimumOrderAmount: number,
    id: number,
  ): Promise<void> {
    try {
      const setting = await this.adminSettingRepository.findOne({
        where: { id },
      });
      if (setting) {
        setting.minimumOrderAmount = minimumOrderAmount;
        await this.adminSettingRepository.save(setting);
      } else {
        const newSetting = new AdminSetting();
        newSetting.minimumOrderAmount = minimumOrderAmount;
        await this.adminSettingRepository.save(newSetting);
        this.clearMinimumOrderAmountCache();
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(
        'Error setting minimum order amount',
      );
    }
  }

  async getSellerEmail(): Promise<string> {
    try {
      const settings = await this.adminSettingRepository.find();

      if (settings.length === 0) {
        throw new NotFoundException('No settings found');
      }

      return settings[length - 1].sellerEmail;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error getting seller email');
    }
  }

  async setSellerEmail(sellerEmail: string, id: number): Promise<void> {
    try {
      const setting = await this.adminSettingRepository.findOne({
        where: { id },
      });
      if (setting) {
        setting.sellerEmail = sellerEmail;
        await this.adminSettingRepository.save(setting);
      } else {
        const newSetting = new AdminSetting();
        newSetting.sellerEmail = sellerEmail;
        await this.adminSettingRepository.save(newSetting);
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error setting seller email');
    }
  }

  async getInfoEmail(): Promise<string> {
    try {
      const settings = await this.adminSettingRepository.find();

      if (settings.length === 0) {
        throw new NotFoundException('No settings found');
      }

      return settings[length - 1].infoEmail;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error getting info email');
    }
  }

  async setInfoEmail(infoEmail: string, id: number): Promise<void> {
    try {
      const setting = await this.adminSettingRepository.findOne({
        where: { id },
      });
      if (setting) {
        setting.infoEmail = infoEmail;
        await this.adminSettingRepository.save(setting);
      } else {
        const newSetting = new AdminSetting();
        newSetting.infoEmail = infoEmail;
        await this.adminSettingRepository.save(newSetting);
      }
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Error setting info email');
    }
  }

  clearMinimumOrderAmountCache() {
    this.cachedMinOrderAmount = null;
  }
}
