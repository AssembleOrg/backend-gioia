import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserRole } from './user.enum';
import { SupabaseService } from 'src/extraServices/supabase.service';
import { checkErrors, validateUser } from 'src/helpers/user.helper';

@Injectable()
export class UserService {
  protected logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly supabaseService: SupabaseService,
  ) {}

  async register({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }) {
    try {
      validateUser(email, password, fullName);

      const { data, error } = await this.supabaseService.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        this.logger.error(error);
        throw new ConflictException('Error signing up');
      }

      const user: Partial<User> = {
        email,
        fullName,
        role: UserRole.USER,
        id: data.user.id,
      };

      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async login({ email, password }: { email: string; password: string }) {
    try {
      const { data, error } =
        await this.supabaseService.supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        this.logger.error(error);
        checkErrors(error);
      }

      const findUser = await this.userRepository.findOne({
        where: { email },
      });
      if (!findUser) {
        throw new ConflictException('User not found');
      }

      const token = data.session.access_token;

      return {
        token,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getUser(id: string) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new ConflictException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
