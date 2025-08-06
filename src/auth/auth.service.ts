import { Injectable } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor() {}
  login(loginDto: LoginUserDto) {
    console.log(loginDto);
  }
}
