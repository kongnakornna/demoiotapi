import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';
require('dotenv').config();
export default function commonConfig(): DataSourceOptions {
  const devConfig = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };

  const prodConfig = {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
  };
  

  // Determine SSL setting - disable for local server
  const sslConfig = process.env.DATABASE_HOST === '192.168.1.40' 
    ? false 
    : { rejectUnauthorized: false };

  return {
    name: 'postgres',
    type: 'postgres',
    logging: true,
    synchronize: false,
    ssl: sslConfig,  // ← Use conditional SSL
    entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
    migrations: ['@root/migrations/**/*{.ts,.js}'],
    ...(process.env.NODE_ENV === 'production' ? prodConfig : devConfig),
  };
}

/* */