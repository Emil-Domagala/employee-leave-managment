import { DataSource } from 'typeorm';
import { getEnvNumber, getEnvString } from './common/utils/getEnv';
import { User } from './user/user.entity';
import { Role } from './user/role.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: getEnvString('DB_HOST'),
  port: getEnvNumber('DB_PORT'),
  username: getEnvString('DB_USERNAME'),
  password: getEnvString('DB_PASSWORD'),
  database: getEnvString('DB_DATABASE'),
  entities: [User, Role],
  synchronize: getEnvString('NODE_ENV') === 'development',
  logging: getEnvString('NODE_ENV') === 'development',
});
