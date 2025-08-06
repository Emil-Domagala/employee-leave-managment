import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor() {}
  login(loginDto: LoginDto) {
    console.log(loginDto);
  }
}
