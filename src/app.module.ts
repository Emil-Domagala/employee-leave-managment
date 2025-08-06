import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LeaveRequestModule } from './leave-request/leave-request.module';

@Module({
  imports: [AuthModule, UserModule, LeaveRequestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
