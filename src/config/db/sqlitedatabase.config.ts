import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
require('dotenv').config();
// console.log('DATABASE_TYPE: sqlite')
// console.log('name: sqliteConnection');
export const sqliteBaseConfig: TypeOrmModule = {
  dialect: 'sqlite',
  storage: process.env.SQLITE_DATABASE_PATH ||  'src/dbsqlite/data.sqlite3',
  autoLoadModels: true,
  synchronize: true,
};
