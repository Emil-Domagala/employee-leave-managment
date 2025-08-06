import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  @IsNotEmpty({ message: 'Email should not be empty.' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long.' })
  @IsNotEmpty({ message: 'Password should not be empty.' })
  password: string;
}
