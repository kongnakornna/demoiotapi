import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@src/modules/auth/auth.service';
import { JwtStrategy } from '@src/modules/auth/jwt.strategy';
import { UsersModule } from '@src/modules/users/users.module';
import { AuthController } from '@src/modules/auth/auth.controller';
import { JwtService } from '@nestjs/jwt';
import 'dotenv/config';
require('dotenv').config();

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      secret: process.env.SECRET_KEY, //'MY_SECRET_KEY', // You should use a real secret here, preferably from environment variables
      signOptions: { expiresIn: '30d' }, // Token expiration time
    }),
  ],
  controllers: [AuthController],
  providers: [
    { provide: AuthService, useClass: AuthService },
    { provide: JwtStrategy, useClass: JwtStrategy },
    // JwtService
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
