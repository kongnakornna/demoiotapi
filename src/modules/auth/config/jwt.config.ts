import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import 'dotenv/config';
require('dotenv').config();

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.SECRET_KEY,
    signOptions: {
      expiresIn: '365d',
    },
  }),
);
