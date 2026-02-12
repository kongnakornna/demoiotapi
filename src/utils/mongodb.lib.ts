import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import * as format from '@src/helpers/format.helper';
import 'dotenv/config';
require('dotenv').config();

console.log(
  '===============================Redis ready process================================================================',
);
// console.log('MONGODB_URL: '+process.env.MONGODB_URL);
// console.log('MONGODB_PORT: '+process.env.MONGODB_PORT);
// console.log('MONGODB_DB: '+process.env.MONGODB_DB);
// console.log('MONGODB_AUTH: '+process.env.MONGODB_AUTH);
const MONGODB_URL_APP =
  'mongodb://' +
  process.env.MONGODB_URL +
  ':' +
  process.env.MONGODB_PORT +
  ':' +
  '/' +
  process.env.MONGODB_DB;
// console.log('MONGODB_URL_APP: '+MONGODB_URL_APP);
/* 
//DB
const MONGO_URL:any= MONGODB_URL_APP;
mongoose.Promise = Promise; //Promises are a programming pattern, handling asynchronous operations to avoid the "callback hell" problem.
mongoose.connect(MONGO_URL);
mongoose.connection.on('error', (error: Error) => console.log(error));
*/
// export class Mongodb {
//     // async SetCacheData(setData: any) {
//     //           const time = setData.time;
//     //           const keycache = setData.keycache;
//     //           const data = setData.data;
//     //           console.log('setcache setData',setData);
//     //           await client.setex(keycache, time, JSON.stringify(data));  // set data cache
//     //           console.log('keycache',keycache);
//     //       return keycache
//     // }
// }
// https://gist.github.com/AliYusuf95/e7faa722d82426008e90b44206a50000
import { ErrorRequestHandler } from 'express';
//const mongoose = require('mongoose');

const mongoose_base_url: any =
  'mongodb://' +
  process.env.MONGODB_URL +
  ':' +
  process.env.MONGODB_PORT +
  '/' +
  process.env.MONGODB_DB;
console.log('mongoose_base_url: ' + mongoose_base_url);

// const connectDB = async () => {
//   try {
//     const mongoURI: string = config.get("mongoURI");
//     await connect(mongoURI);
//     console.log("MongoDB Connected...");
//   } catch (err) {
//     console.error(err.message);
//     // Exit process with failure
//     process.exit(1);
//   }
// };
// export default connectDB;
