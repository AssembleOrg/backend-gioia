// roles.guard.ts
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/user/user.enum';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UserService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<UserRole[]>(
      'roles',
      ctx.getHandler(),
    );
    if (!requiredRoles) return true;

    const req = ctx.switchToHttp().getRequest();
    const supabaseId = req.user?.supabaseId;
    if (!supabaseId) throw new UnauthorizedException();

    const user = await this.usersService.getUser(supabaseId);
    if (!user) throw new UnauthorizedException('User not found');

    if (!requiredRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException(
        `Requires one of: ${requiredRoles.join(', ')}`,
      );
    }

    // now req.user is the full user record
    req.user = user;
    return true;
  }
}
