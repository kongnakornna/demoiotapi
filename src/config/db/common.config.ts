import { join } from 'path';
import { DataSourceOptions } from 'typeorm';
import 'dotenv/config';
require('dotenv').config();
// console.log('process.env.DATABASE_HOST');console.info(process.env.DATABASE_HOST)
// console.log('name: postgresConnection');
// console.log('DATABASE_TYPE: postgres');
// console.log('DATABASE_HOST: '+process.env.DATABASE_HOST);
// console.log('DATABASE_PORT: '+process.env.DATABASE_PORT);
// console.log('DATABASE_USERNAME: '+process.env.DATABASE_USERNAME);
// console.log('DATABASE_PASSWORD: '+process.env.DATABASE_PASSWORD);
// console.log('DATABASE_NAME: '+process.env.DATABASE_NAME);
export default function commonConfig(): DataSourceOptions {
  const devConfig = {
    name: 'Postgres_Connection',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    ssl: null,
  };
  const prodConfig = {
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  };
  JSON.stringify(devConfig);
  JSON.stringify(prodConfig);
  // console.log('devConfig=>');console.info(devConfig);
  // console.log('prodConfig-');console.info(prodConfig);
  return {
    name: 'Postgres_Connection',
    type: 'postgres',
    logging: true, //true,
    synchronize: true, // false //true,
    entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
    migrations: [
      //'../../migrations/**/*{.ts,.js}',
      '@root/migrations/**/*{.ts,.js}',
    ],
    ...(process.env.NODE_ENV === 'production' ? prodConfig : devConfig),
  };
}
