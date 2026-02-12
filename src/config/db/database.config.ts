import { TypeOrmModule } from '@nestjs/typeorm';
// console.log('DATABASE_TYPE: sqlite')
// console.log('name: sqliteConnection');
import * as path from 'path';
import * as format from '@src/helpers/format.helper';
import 'dotenv/config';
require('dotenv').config();

export const sqliteBaseConfig: TypeOrmModule = {
  dialect: 'sqlite',
  storage: process.env.SQLITE_DATABASE_PATH || 'dbsqlite/data.sqlite3',
  autoLoadModels: true,
  synchronize: true,
};
