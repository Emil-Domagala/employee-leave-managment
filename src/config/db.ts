// src/config/db.ts
import { Pool } from 'pg';
import { getEnvNumber, getEnvString } from '../common/utils/getEnv';
import { ConfigError } from '../common/errors/configError';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { seedAdmin } from '../db/seedAdmin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let _pool: Pool | null = null;

export const createPool = () => {
  const host = getEnvString('DB_HOST');
  const port = getEnvNumber('DB_PORT');
  const user = getEnvString('DB_USERNAME');
  const password = getEnvString('DB_PASSWORD');
  const database = getEnvString('DB_DATABASE');

  return new Pool({ host, port, user, password, database });
};

export const getPool = () => {
  if (!_pool) {
    _pool = createPool();

    _pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
      process.exit(-1);
    });
  }
  return _pool;
};

export const testConnection = async () => {
  const pool = getPool();
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    console.log('Postgres connection OK');
  } catch (err) {
    console.error('Postgres connection failed:', err);
    throw new ConfigError('Failed to connect to Postgres');
  }
};

export const applySchema = async () => {
  const pool = getPool();
  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf-8');
  await pool.query(sql);
  console.log('Schema applied');
};
