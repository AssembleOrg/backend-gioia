import { BadRequestException } from '@nestjs/common';
import { AuthError } from '@supabase/supabase-js';
import { isEmail } from 'class-validator';

export function validateUser(
  email: string,
  password: string,
  fullName: string,
) {
  if (!isEmail(email)) throw new BadRequestException('Email is not valid');

  if (password.length < 8)
    throw new BadRequestException('Password is too short');

  if (fullName.trim().length < 8)
    throw new BadRequestException('Full name is too short');
}

export function checkErrors(error: AuthError) {
  if (error.status === 400 && error.message.includes('email')) {
    throw new BadRequestException('Email is not valid or Is not confimed');
  }

  if (error.status === 400 && error.message.includes('password')) {
    throw new BadRequestException('Password is not valid');
  }
}
