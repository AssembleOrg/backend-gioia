import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ILike, Repository } from 'typeorm';
import { UserRole } from './user.enum';
import { SupabaseService } from 'src/extraServices/supabase.service';
import { checkErrors, validateUser } from 'src/helpers/user.helper';
import { Cart } from 'src/cart/cart.entity';

@Injectable()
export class UserService {
  protected logger = new Logger('UserService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly supabaseService: SupabaseService,
    @InjectRepository(Cart)
    private readonly cartService: Repository<Cart>,
  ) {}

  async registerWithCart({
    email,
    password,
    fullName,
    cart,
  }: {
    email: string;
    password: string;
    fullName: string;
    cart: Partial<Cart>;
  }) {
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

    await this.cartService.save({
      userId: user.id,
      cart,
    });
  }

  async register({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }) {
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
  }

  async login({ email, password }: { email: string; password: string }) {
    this.logger.log(`Logging with password: ${password}`);
    this.logger.log(`Email: ${email}`);
    const { data, error } =
      await this.supabaseService.supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      this.logger.error(error);
      checkErrors(error);
    }

    const normalizedEmail = data.user.email.trim().toLowerCase();

    const findUser = await this.userRepository.findOne({
      where: { email: ILike(normalizedEmail) },
    });
    if (!findUser) {
      throw new ConflictException('User not found');
    }

    const token = data.session.access_token;

    return {
      token,
    };
  }

  async getUser(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new ConflictException('User not found');
    }

    return user;
  }
}
