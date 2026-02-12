import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import 'dotenv/config';
require('dotenv').config();

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: process.env.SECRET_KEY,

    expiresIn: '365d',
  }),
);
