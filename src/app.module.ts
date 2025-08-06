import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { LeaveRequestModule } from './leave-request/leave-request.module';
import * as dotenv from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';

dotenv.config();
const DB_ENV_VARS = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
};

if (
  !DB_ENV_VARS.host ||
  !DB_ENV_VARS.port ||
  !DB_ENV_VARS.username ||
  !DB_ENV_VARS.password ||
  !DB_ENV_VARS.database
)
  throw new Error('Missing DB environment variables');

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DB_ENV_VARS.host,
      port: DB_ENV_VARS.port,
      username: DB_ENV_VARS.username,
      password: DB_ENV_VARS.password,
      database: DB_ENV_VARS.database,
      entities: [User],
      synchronize: true, // For dev only! Use migrations for prod
    }),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UserModule,
    LeaveRequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
