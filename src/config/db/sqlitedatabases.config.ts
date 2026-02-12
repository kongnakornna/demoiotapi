import { SequelizeModuleOptions } from '@nestjs/sequelize';
import 'dotenv/config';
require('dotenv').config();
// console.log('DATABASE_TYPE: sqlite')
// console.log('name: sqliteConnection');
export const sqliteBaseConfigs: SequelizeModuleOptions = {
  dialect: 'sqlite',
  storage:  process.env.SQLITE_DATABASE_PATH || 'src/dbsqlite/data.sqlite3',  
  autoLoadModels: true,
  synchronize: true,
};
