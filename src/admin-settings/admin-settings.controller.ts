import { Body, Controller, Get, Logger, Put, UseGuards } from '@nestjs/common';
import { AdminSettingsService } from './admin-settings.service';
import { UserRole } from 'src/user/user.enum';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('admin-settings')
export class AdminSettingsController {
  protected logger = new Logger('AdminSettingsController');

  constructor(private readonly adminSettingsService: AdminSettingsService) {}

  @Get('minimum-order-amount')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async getMinimumOrderAmount(): Promise<number> {
    return await this.adminSettingsService.getMinimumOrderAmount();
  }

  @Put('minimum-order-amount')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Minimum order amount updated',
  })
  async setMinimumOrderAmount(
    @Body() body: { minimumOrderAmount: number; id: number },
  ): Promise<void> {
    const { minimumOrderAmount, id } = body;
    return await this.adminSettingsService.setMinimumOrderAmount(
      minimumOrderAmount,
      id,
    );
  }

  @Get('seller-email')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse()
  async getSellerEmail(): Promise<string> {
    return await this.adminSettingsService.getSellerEmail();
  }

  @Put('seller-email')
  @Roles(UserRole.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Seller email updated',
  })
  async setSellerEmail(
    @Body() body: { sellerEmail: string; id: number },
  ): Promise<void> {
    const { sellerEmail, id } = body;
    return await this.adminSettingsService.setSellerEmail(sellerEmail, id);
  }

  @Get('info-email')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Info email',
  })
  async getInfoEmail(): Promise<string> {
    return await this.adminSettingsService.getInfoEmail();
  }

  @Put('info-email')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Info email updated',
  })
  async setInfoEmail(
    @Body() body: { infoEmail: string; id: number },
  ): Promise<void> {
    const { infoEmail, id } = body;
    return await this.adminSettingsService.setInfoEmail(infoEmail, id);
  }
}
