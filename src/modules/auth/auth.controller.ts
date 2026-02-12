import {
  Controller,
  Res,
  Post,
  Body,
  ValidationPipe,
  UnprocessableEntityException,
  Get,
  UseGuards,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Query,
  Req,
  Injectable,
  Headers,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  Header,
} from '@nestjs/common';
var moment = require('moment');
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AuthService } from '@src/modules/auth/auth.service';
import { UsersService } from '@src/modules/users/users.service';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { CreateUserDemoDtoApp } from '@src/modules/users/dto/create-demo-user-app.dto';
import { CreateUserDemoDtoApp1 } from '@src/modules/users/dto/create-demo-user-app1.dto';
import { CreateUserDemoDtoApp2 } from '@src/modules/users/dto/create-demo-user-app2.dto';
import { CreateUserDemoDtoApp3 } from '@src/modules/users/dto/create-demo-user-app3.dto';
import { CreateUserDemoDtoApp4} from '@src/modules/users/dto/create-demo-user-app4.dto';
import { CreateUserDemoDtoApp5 } from '@src/modules/users/dto/create-demo-user-app5.dto';
import { CreateUserDemoDtoApp6 } from '@src/modules/users/dto/create-demo-user-app6.dto';
import { CreateUserDemoDtoApp7 } from '@src/modules/users/dto/create-demo-user-app7.dto';
import { CreateUserDemoDtoApp8 } from '@src/modules/users/dto/create-demo-user-app8.dto';
import { CreateUserDemoDtoApp9 } from '@src/modules/users/dto/create-demo-user-app9.dto';
import { CreateUserDemoDtoApp10 } from '@src/modules/users/dto/create-demo-user-app10.dto';
import { UserAuthModel } from '@src/modules/users/dto/user-auth.dto';
import { EmailChk } from '@src/modules/users/dto/email-chk.dto';
import { UserDtoAuthModel } from '@src/modules/users/dto/user-dto-auth.dto';
import { CreateUserDemoDto } from '@src/modules/users/dto/create-demo-user.dto';
import { ResetDto } from '@src/modules/users/dto/Reset.dto';
import { otpverifyDto } from '@src/modules/redis/dto/otpverify.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtRefreshAuthGuard } from '@src/modules/auth/guards/jwt-refresh-auth.guard';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { AuthGuardUser } from '@src/modules/auth/auth.guarduser';
import { CurrentUser } from '@src/modules/auth/current-user.decorator';
import * as format from '@src/helpers/format.helper';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthUserRequired } from '@src/modules/auth/auth.decorator';
import { RefreshJwtGuard } from '@src/modules/auth/guards/refresh.guard';
const { passwordStrength, defaultOptions } = require('check-password-strength');
import { CacheDataOne } from '@src/utils/cache/redis.cache';
import { redisDto } from '@src/modules/redis/dto/redis.dto';
import { redisUserDto } from '@src/modules/redis/dto/redisuser.dto';
var Cache = new CacheDataOne();
var demoactive :any =1;  // 1 on 0=off
import 'dotenv/config';
require('dotenv').config();
const API_VERSION = '1';
import * as argon2 from 'argon2';
// console.log('SECRET_KEY: ' + process.env.SECRET_KEY);

@Injectable()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwtService: JwtService,
    private authService: AuthService,
    private readonly userService: UsersService,
  ) {}
  // http://172.25.99.60:3003/v1/auth/demo
  @HttpCode(HttpStatus.OK)
  @Get('/demo')
  async demo(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
          data: 'OFF',
          message: 'Out of service.',
          message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }
  @HttpCode(HttpStatus.OK)
  @Get('/demo1')
  async demo1(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp1,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }
  @HttpCode(HttpStatus.OK)
  @Get('/demo2')
  async demo2(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp2,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/demo3')
  async demo3(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp3,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/demo4')
  async demo4(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp4,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/demo5')
  async demo5(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp5,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/demo6')
  async demo6(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp6,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }
 
  @HttpCode(HttpStatus.OK)
  @Get('/demo7')
  async demo7(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp7,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }


  @HttpCode(HttpStatus.OK)
  @Get('/demo8')
  async demo8(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp8,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }


  @HttpCode(HttpStatus.OK)
  @Get('/demo9')
  async demo9(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp9,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Get('/demo10')
  async demo10(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDtoApp10,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('/generatetoken')
  async generatetoken(
    @Req() request: Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDemoDto,
  ): Promise<void> {
    try {
      if(demoactive!=1){
        res.status(HttpStatus.NOT_FOUND).json({
            data: 'OFF',
            message: 'Out of service.',
            message_th: 'ไม่สามารถใช้งานได้.',
        });
        return;
      }
      if (!userModel) {
        res.status(HttpStatus.NOT_FOUND).json({
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Data not found in system.',
          message_th: 'ไม่พบข้อมูลในระบบ.',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        const data = await this.authService.authenticateSetGen(userModel);
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          payload: data,
        });
        return;
      }

      await this.userService.createsystem(userModel);
      const data = await this.authService.authenticateSetGen(userModel);
      res.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }
  
  @HttpCode(HttpStatus.OK)
  @Post('/reset')
  async ResetSystem(
    @Req() Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) ResetModel: ResetDto,
  ): Promise<string> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    //  console.log('Request_headers_secretkey=>'+secretkey)
    //  console.info('SECRET_KEY=>'+process.env.SECRET_KEY)
    //console.info('process.env>'+process.env)
    if (secretkey != 'Cmon@Amin1') {
      res.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: 'Forbidden! KEY is not valid ..',
        message_th: 'KEY นี้ไม่มีในระบบ.',
      });
      return;
    }
    if (!ResetModel) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        payload: ResetModel,
        message: 'Data not found in system.',
        message_th: 'ไม่พบข้อมูลในระบบ.',
      });
      return;
    }
    // console.log('ResetModel=>')
    // console.info(ResetModel)
    // console.log('email=>'+ResetModel.email)
    // console.log('username=>'+ResetModel.username)
    const emailExists = await this.userService.findByEmail(ResetModel.email);
    if (emailExists) {
      // console.log('emailExists=>'+emailExists.email)
      // console.log('ResetModel=>'+ResetModel)
      //console.info(emailExists)
      const data = await this.authService.authenticateSetGen(ResetModel);
      res.status(200).json({
        statusCode: 200,
        payload: data,
      });
      return;
      //res.status(HttpStatus.OK).json({payload:data});
      //throw new UnprocessableEntityException();
    }
    const usernameRs = await this.userService.getUserByusername(
      ResetModel.username,
    );
    if (usernameRs) {
      // console.log('username=>' + usernameRs.username);
      const data = await this.authService.authenticateSetGen(ResetModel);
      res.status(200).json({
        statusCode: 200,
        payload: data,
      });
      return;
      //res.status(HttpStatus.OK).json({payload:data});
      //throw new UnprocessableEntityException();
    }
    await this.userService.createsystem(ResetModel);
    const data = await this.authService.authenticateSetGen(ResetModel);
    res.status(201).json({
      statusCode: 201,
      payload: data,
    });
    return;
    //res.status(HttpStatus.CREATED).json({payload:data});
  }

  @HttpCode(HttpStatus.OK)
  @Get('allRevenue-data')
  async allRevenueData(@Req() req, @Res() res: Response) {
    // console.log("req.headers=>");console.info(req.headers);
    let idx = req.headers.id;
    // console.log('idx=>'+idx);
    let secretkey: any = req.headers.secretkey;
    await this.authService.checkRefreshToken(idx);
    // if (secretkey != process.env.SECRET_KEY) {
    //   res.status(403).json({
    //     statusCode: 403,
    //     message: 'Forbidden! KEY is not valid ..',
    //     message_th: 'KEY นี้ไม่มีในระบบ.',
    //   });
    //   return;
    // }
    if (idx == null || idx == '') {
      res.status(403).json({
        statusCode: 403,
        message: 'Plase send! system id..',
        message_th: 'กรุณาระบุ system id.',
      });
      return;
    }
    const userInfo: any = await this.userService.getUser(idx);
    if (!userInfo) {
      res.status(422).json({
        statusCode: 422,
        message: 'The specified information was not found."',
        message_th: 'ไม่พบข้อมูลที่ระบุ..',
      });
    }
    // console.log("userInfo=>")
    // console.info(userInfo)

    if (userInfo.refresh_token == null || userInfo.refresh_token == '') {
      res.status(422).json({
        statusCode: 422,
        message: 'Token information not found.',
        message_th: 'ไม่พบข้อมูล Token ที่ระบุ..',
        payload: userInfo.id,
      });
    }

    const TokenTime: any = await this.authService.generateTokenTime(idx);
    const refreshtoken_data = await this.authService.generateAccessToken(idx);
    await this.userService.updaterefreshtoken(idx, refreshtoken_data);
    // console.log('refreshtoken_data =>');console.info(refreshtoken_data);
    var decoded: any = {};
    var decoded: any = this.jwtService.decode(TokenTime);
    var iat = decoded.iat * 1000;
    var exp = decoded.exp * 1000;
    var d1 = new Date(iat);
    var d2 = new Date(exp);
    var EXPIRE_TIME = Number(exp - iat);
    var TokenDate: any = {
      signin: iat,
      expires: exp,
      EXPIRE_TIME: EXPIRE_TIME,
      EXPIRE_DAY: process.env.EXPIRE_DAY,
      signin_date: format.timeConvertermas(d1),
      expires_date: format.timeConvertermas(d2),
    };
    res.status(200).json({
      statusCode: 200,
      message: 'New token',
      message_th: 'สร้างโทเค็นใหม่.',
      payload: { id: idx, token: TokenTime, TokenDate: TokenDate },
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('allRevenue')
  async allRevenue(@Req() req, @Res() res: Response) {
    // console.log("req.headers=>"); console.info(req.headers);
    let idx = req.headers.id;
    // console.log('idx=>'+idx)
    let secretkey: any = req.headers.secretkey;
    await this.authService.checkRefreshToken(idx);
    // if (secretkey != process.env.SECRET_KEY) {
    //   res.status(403).json({
    //     statusCode: 403,
    //     message: 'Forbidden! KEY is not valid ..',
    //     message_th: 'KEY นี้ไม่มีในระบบ.',
    //   });
    //   return;
    // }
    if (idx == null || idx == '') {
      res.status(403).json({
        statusCode: 403,
        message: 'Plase send! system id..',
        message_th: 'กรุณาระบุ system id.',
      });
      return;
    }
    const userInfo: any = await this.userService.getUser(idx);
    if (!userInfo) {
      res.status(422).json({
        statusCode: 422,
        message: 'The specified information was not found."',
        message_th: 'ไม่พบข้อมูลที่ระบุ..',
      });
    }
    // console.log("userInfo=>")
    // console.info(userInfo)

    if (userInfo.refresh_token == null || userInfo.refresh_token == '') {
      res.status(422).json({
        statusCode: 422,
        message: 'Token information not found.',
        message_th: 'ไม่พบข้อมูล Token ที่ระบุ..',
        payload: userInfo.id,
      });
    }

    const TokenTime: any = await this.authService.generateTokenTime(idx);
    const refreshtoken_data = await this.authService.generateAccessToken(idx);
    await this.userService.updaterefreshtoken(idx, refreshtoken_data);
    // console.log('refreshtoken_data =>');;console.info(refreshtoken_data);
    var decoded: any = {};
    var decoded: any = this.jwtService.decode(TokenTime);
    var iat = decoded.iat * 1000;
    var exp = decoded.exp * 1000;
    var d1 = new Date(iat);
    var d2 = new Date(exp);
    var EXPIRE_TIME = Number(exp - iat);
    var TokenDate: any = {
      signin: iat,
      expires: exp,
      EXPIRE_TIME: EXPIRE_TIME,
      EXPIRE_DAY: process.env.EXPIRE_DAY,
      signin_date: format.timeConvertermas(d1),
      expires_date: format.timeConvertermas(d2),
    };
    res.status(200).json({
      statusCode: 200,
      message: 'New token',
      message_th: 'สร้างโทเค็นใหม่.',
      payload: { id: idx, token: TokenTime, TokenDate: TokenDate },
    });
  }

  @HttpCode(HttpStatus.OK)
  @Get('resetToken')
  async resetToken(@Req() req, @Res() res: Response) {
    // console.log("req.headers=>");   console.info(req.headers);
    let idx = req.headers.id;
    // console.log('idx=>'+idx);
    let secretkey: any = req.headers.secretkey;
    await this.authService.checkRefreshToken(idx);
    // if (secretkey != process.env.SECRET_KEY) {
    //   res.status(403).json({
    //     statusCode: 403,
    //     message: 'Forbidden! KEY is not valid ..',
    //     message_th: 'KEY นี้ไม่มีในระบบ.',
    //   });
    //   return;
    // }
    if (idx == null || idx == '') {
      res.status(403).json({
        statusCode: 403,
        message: 'Plase send! system id..',
        message_th: 'กรุณาระบุ system id.',
      });
      return;
    }
    const userInfo: any = await this.userService.getUser(idx);
    if (!userInfo) {
      res.status(422).json({
        statusCode: 422,
        message: 'The specified information was not found."',
        message_th: 'ไม่พบข้อมูลที่ระบุ..',
      });
    }
    // console.log("userInfo=>")
    // console.info(userInfo)

    if (userInfo.refresh_token == null || userInfo.refresh_token == '') {
      res.status(422).json({
        statusCode: 422,
        message: 'Token information not found.',
        message_th: 'ไม่พบข้อมูล Token ที่ระบุ..',
        payload: userInfo.id,
      });
      return;
    }

    const TokenTime: any = await this.authService.generateTokenTime(idx);
    const refreshtoken_data = await this.authService.generateAccessToken(idx);
    await this.userService.updaterefreshtoken(idx, refreshtoken_data);
    // console.log('refreshtoken_data =>');
    console.info(refreshtoken_data);
    var decoded: any = {};
    var decoded: any = this.jwtService.decode(TokenTime);
    var iat = decoded.iat * 1000;
    var exp = decoded.exp * 1000;
    var d1 = new Date(iat);
    var d2 = new Date(exp);
    var EXPIRE_TIME = Number(exp - iat);
    var TokenDate: any = {
      signin: iat,
      expires: exp,
      EXPIRE_TIME: EXPIRE_TIME,
      EXPIRE_DAY: process.env.EXPIRE_DAY,
      signin_date: format.timeConvertermas(d1),
      expires_date: format.timeConvertermas(d2),
    };
    res.status(200).json({
      statusCode: 200,
      message: 'New token',
      message_th: 'สร้างโทเค็นใหม่.',
      payload: { id: idx, token: TokenTime, TokenDate: TokenDate },
    });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Validate user OTP.' })
  @Post('/validateotp')
  async SigninvalidateOTP(
    @Req() Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) caseModel: redisUserDto,
  ): Promise<{ message: 'ok'; statuscode: 200 }> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    let time: any = Request.headers.time || 120;
    // console.log('Request_headers_secretkey=>' + secretkey);
    // console.log('SECRET_KEY=>' + process.env.SECRET_KEY);
    // console.log('Request_headers_time=>' + time);
    const keycache: any = caseModel.keycache;
    const otpvalidate: any = caseModel.otpvalidate;
    // console.log('keycache=>' + keycache);
    // console.log('otpvalidate=>' + otpvalidate);
    // if (secretkey != process.env.SECRET_KEY) {
    //   res.status(200).json({
    //     statuscode: 200,
    //     code: 400,
    //     message: 'Forbidden! SKEY is not valid .',
    //     message_th: 'Forbidden! SKEY is not valid ..',
    //     payload: null,
    //   });
    //   return;
    // }
    console.info('keycache', keycache);
    console.info('otpvalidate', otpvalidate);
    var inputOTP: any = { keycache: keycache, otpvalidate: otpvalidate };
    const inputOTPa: any = await Cache.validateGetUser(inputOTP);
    if (inputOTPa === null || inputOTPa === '') {
      var result: any = {
        statuscode: 200,
        code: 400,
        message: 'OTP is null',
        message_th: 'OTP is null',
        payload: null,
      };
      console.info('otp result', result);
      res.status(200).json(result);
      return;
    }

    const Profiles: any = await this.userService.getProfile(inputOTPa.uid);
    const Profile: any = Profiles[0];
    const ProfileRs: any = {
      uid: Profile.uid,
      role_id: Profile.roleid,
      email: Profile.email,
      username: Profile.username,
      firstname: Profile.firstname,
      lastname: Profile.lastname,
      fullname: Profile.fullname,
      nickname: Profile.nickname,
      idcard: Profile.idcard,
      lastsignindate: Profile.lastsignindate,
      status: Profile.status,
      active_status: Profile.active_status,
      network_id: Profile.network_id,
      remark: Profile.remark,
      infomation_agree_status: Profile.infomation_agree_status,
      gender: Profile.gender,
      birthday: Profile.birthday,
      online_status: Profile.online_status,
      message: Profile.message,
      network_type_id: Profile.network_type_id,
      public_status: Profile.public_status,
      type_id: Profile.type_id,
      avatarpath: Profile.avatarpath,
      avatar: Profile.avatar,
      refresh_token: Profile.refresh_token,
      createddate: Profile.createdDate,
      updateddate: Profile.updatedDate,
      deletedate: Profile.deleteDate,
      loginfailed: Profile.loginFailed,
    };
    var result: any = {
      statuscode: 200,
      code: 200,
      message: 'OTP',
      message_th: 'OTP',
      payload: ProfileRs,
      //, payload2: inputOTPa
    };
    console.info('otp result', result);
    res.status(200).json(result);
    return;
  }

   @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async Signin(
    @Res() res: Response,
    @Body(new ValidationPipe()) auth: UserAuthModel,
  ): Promise<void> {
    try {
      const data: any = await this.authService.authenticateEmail(auth);
      
      if (data.uid && data.loginfailed >= 10) {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          code: 400,
          message: 'This user is locked please contact admin..',
          message_th: 'ผู้ใช้นี้ถูกล็อค กรุณาติดต่อผู้ดูแลระบบ..',
          payload: null,
        });
        return;
      }

      if (!data.uid) {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          code: 400,
          message: 'Sign in failed!',
          message_th: 'เข้าระบบไม่สำเร็จ กรุณาลองใหม่..',
          payload: null,
        });
        return;
      }

      if (data.uid) {
        const checkUserActive = await this.userService.checkUserActive(data.uid);
        if (!checkUserActive) {
          res.status(HttpStatus.OK).json({
            statusCode: HttpStatus.OK,
            code: 403,
            message: 'This account is inactive.',
            message_th: 'บัญชีนี้ไม่อยู่ในสถานะพร้อมใช้งาน.',
            payload: null,
          });
          return;
        }
      }

      const DataUpdate = {
        id: data.uid,
        lastsignindate: new Date(),
      };
      await this.userService.updateSdUser(DataUpdate);

      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        code: 200,
        message: 'Sign In Successful.',
        message_th: 'เข้าระบบสำเร็จ.',
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signinuser')
  async SigninUser(
    @Res() res: Response,
    @Body() auth: any,
  ): Promise<void> {
    try {
      if (!auth.email) {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          code: 400,
          message: 'Email is required.',
          message_th: 'กรุณาระบุอีเมล.',
          payload: null,
        });
        return;
      }

      if (!auth.password) {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          code: 400,
          message: 'Password is required.',
          message_th: 'กรุณาระบุรหัสผ่าน.',
          payload: null,
        });
        return;
      }

      const data: any = await this.authService.authenticateEmail(auth);
      
      // ... similar validation logic as Signin method
      // (reuse the same validation logic)

      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        code: 200,
        message: 'Sign In Successful.',
        message_th: 'เข้าระบบสำเร็จ.',
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signinapp')
  async Signinapp(
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
    @Res() res: Response,
    @Body() auth: any,
  ): Promise<string> {
    // username 
    console.log('login user =>')
    console.info(auth)
    if (!auth.username) {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        message: ' username is null..',
        message_th: 'username ไม่ถูกส่งมา..',
        payload: null,
      });
      return;
    }
    if (!auth.password) {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        message: 'password is null..',
        message_th: 'password ไม่ถูกส่งมา..',
        payload: null,
      });
      return;
    }
    // console.log('Signinapp =>');
    //console.info(auth); // return
    const datas: any = await this.authService.authenticateuser(auth);
    // console.log('signinapp login datas=>');
    // console.info(datas); //return datas;
    var loginfailed: number = datas.loginfailed;
    if (datas.uid && loginfailed >= 10) {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        message: 'This is user Locked please contact admin..',
        message_th: 'ผู้ใช้นี้ถูกล็อค กรุณาติดต่อผู้ดูแลระบบ..',
        payload: null,
      });
      return;
    }
    if (!datas.uid) {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        message: 'Sign in failed!',
        message_th: 'เข้าระบบไม่สำเร็จ กรุณาลองใหม่..',
        payload: null,
      });
      return;
    }
    if (datas.uid) {
      let checkUserActive: any = await this.userService.checkUserActive(
        datas.uid,
      );
      if (checkUserActive < 1) {
        res.status(200).json({
          statusCode: 200,
          code: 403,
          message: 'This account Inactive status.',
          message_th: 'บัญชีนี้ ไม่อยู่ในสถานะ พร้อมใช้งาน.',
          payload: null,
        });
        return;
      }
    }
    let DataUpdate: any = {};
    DataUpdate.id = datas.uid;
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    const updateddate: any = moment(new Date(), DATE_TIME_FORMAT);
    DataUpdate.lastsignindate = Date();
    await this.userService.updateSdUser(DataUpdate);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      message: 'Sign In Successful.',
      message_th: 'เข้าระบบสำเร็จ.',
      payload: datas,
    });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/userUnlock')
  async userUnlock(
    @Req() Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) auth: EmailChk,
  ): Promise<string> {
    let secretkey: any = Request.headers.secretkey;
    //  console.log('Request_headers_secretkey=>'+secretkey)
    //  console.info('SECRET_KEY=>'+process.env.SECRET_KEY)
    // console.info('process.env>'+process.env)
    // if (secretkey != process.env.SECRET_KEY) {
    //   res.status(403).json({
    //     statusCode: 403,
    //     message: 'Forbidden! KEY is not valid ..',
    //     message_th: 'KEY นี้ไม่มีในระบบ.',
    //   });
    //   return;
    // }
    const data: any = await this.authService.userUnlock(auth);
    // res.status(200).json({
    //       statusCode: 200,
    //       message: 'Test.',
    //       loginfailed: data.loginfailed,
    //       payload: data,
    //   });
    //   return

    var loginfailed: number = data.loginfailed;
    if (loginfailed != 0) {
      res.status(403).json({
        statusCode: 403,
        message: 'This is user Locked..',
        message_th: 'ผู้ใช้นี้ถูกล็อค..',
        payload: null,
      });
      return;
    }
    res.status(200).json({
      statusCode: 200,
      message: 'This user unlock successful.',
      message_th: 'ผู้ใช้รายนี้ปลดได้ทำการล็อคแล้ว.',
      payload: data,
    });
    return;
  }

  @HttpCode(201)
  @Post('/signup')
  async signup(
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDto,
  ): Promise<void> {
    try {
      const checkEmailFormat = format.checkEmail(userModel.email);
      if (!checkEmailFormat) {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          code: 422,
          message: 'Invalid email format.',
          message_th: 'รูปแบบอีเมล์ไม่ถูกต้อง',
        });
        return;
      }

      const emailExists = await this.userService.findByEmail(userModel.email);
      if (emailExists) {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          code: 422,
          message: 'The email already exists.',
          message_th: 'อีเมลนี้มีอยู่ในระบบแล้ว',
        });
        return;
      }

      const usernameRs = await this.userService.getUserByusername(userModel.username);
      if (usernameRs) {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          code: 422,
          message: 'The username already exists.',
          message_th: 'ชื่อผู้ใช้นี้มีอยู่ในระบบแล้ว',
        });
        return;
      }

      if (userModel.password !== userModel.confirm_password) {
        res.status(HttpStatus.OK).json({
          statusCode: HttpStatus.OK,
          code: 400,
          message: 'Passwords do not match.',
          message_th: 'รหัสผ่านไม่ตรงกัน',
        });
        return;
      }

      await this.userService.create(userModel);
      const data = await this.authService.authenticate(userModel);

      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        code: 200,
        message: 'Register successfully.',
        message_th: 'ลงทะเบียนสำเร็จ',
        payload: data,
      });
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
        message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      });
    }
  }


  @HttpCode(201)
  @Post('/signup3')
  async signup3(
    @Req() Req,
    @Query() query: any,
    @Res() res: Response,
    @Body(new ValidationPipe()) userModel: CreateUserDto,
    //@Body(new ValidationPipe()) userModel: any,
  ): Promise<string> {
     const option: number = Number(query.option) || 0;
    const checkEmailfomat: any = format.checkEmail(userModel.email);
    if (checkEmailfomat == false || checkEmailfomat === 0) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { email: userModel.email },
        message: 'Invalid email format.',
        message_th: 'รูปแบบอีเมล์ไม่ถูกต้อง',
      });
      return;
    }
    const emailExists: any = await this.userService.findByEmail(
      userModel.email,
    );
    if (emailExists) {
      // console.log('emailExists=>' + emailExists.email);
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: { email: emailExists.email },
        message: 'The email duplicate this data cannot signup.',
        message_th: 'ข้อมูล email'+userModel.email+' ซ้ำไม่สามารถลงทะเบียนได้.',
      });
      return;
      //throw new UnprocessableEntityException();
    } else if (!emailExists) {
      const usernameRs: any = await this.userService.getUserByusername(
        userModel.username,
      );
      if (usernameRs) {
        // console.log('username=>' + usernameRs.username);
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: { username: usernameRs.username },
          message: 'The username duplicate this data cannot signup.',
          message_th: 'ข้อมูล username '+userModel.username+' ซ้ำไม่สามารถลงทะเบียนได้.',
        });
        return;
        //throw new UnprocessableEntityException();
      }
    }
    const password: any = passwordStrength(userModel.password).value;
    const confirm_password: any = passwordStrength(
      userModel.confirm_password,
    ).value;
    // console.log('password----->');
    // console.info(password);
    // console.log('confirm_password----->');
    // console.info(confirm_password);
    if (userModel.password != userModel.confirm_password) {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        payload: null,
        message: 'Passwords do not match.. ',
        message_th: 'รหัสผ่านไม่ตรงกัน..',
      });
      return;
    }
    // console.log('option----->');
    // console.info(option);
    // if(option==0){
    //   if (password === 'Weak' || confirm_password === 'Weak') {
    //       res.status(200).json({
    //         statusCode: 200,
    //         code: 400,
    //         payload: null,
    //         message: 'Password is ' + password + ' please change it for security.',
    //         message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
    //       });
    //       return;
    //     }
    //     if (password === 'Medium' || confirm_password === 'Medium') {
    //       res.status(200).json({
    //         statusCode: 200,
    //         code: 400,
    //         payload: null,
    //         message: 'Password is ' + password + ' please change it for security.',
    //         message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
    //       });
    //       return;
    //     }
    //     if (password != 'Strong' || confirm_password != 'Strong') {
    //       res.status(200).json({
    //         statusCode: 200,
    //         code: 400,
    //         payload: null,
    //         message: 'Password is ' + password + ' please change it for security.',
    //         message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
    //       });
    //       return;
    //     }
    // }
  
    await this.userService.create(userModel);
    const data: any = await this.authService.authenticate(userModel);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: data,
      message: 'Register successfully..',
      message_th: 'ลงทะเบียนสำเร็จ..',
    });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'This Redis.' })
  @Get('/otp')
  async otp(@Req() Request): Promise<{ message: 'ok'; statuscode: 200 }> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    let time: Number = Number(Request.headers.time) || 60;
    // console.log('Request_headers_secretkey=>'+secretkey);
    // console.log('SECRET_KEY=>'+process.env.SECRET_KEY);
    // console.log('Request_headers_time=>'+time);
    // if (secretkey != process.env.SECRET_KEY) {
    //   var result: any = {
    //     statuscode: 200,
    //     message: 'Forbidden! SKEY is not valid . ',
    //   };
    //   return result;
    // }
    const Randomint: any = format.getRandomint(6);
    const otpot: any = await Cache.OTPTIME(Randomint, time);
    const keycache: any = otpot.key;
    const otpvalidate: number = otpot.otp;
    // console.info('otpot', otpot);
    var input: any = {
      keycache: keycache,
      otpvalidate: otpvalidate,
    };
    var result: any = {
      statuscode: 200,
      message: 'OTP',
      payload: otpot,
      validateOTP: Cache.validateGet(input),
    };
    return result;
  }

  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'This Redis.' })
  @Post('/verifyotp')
  async verifyOTP(
    @Req() Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) caseModel: redisDto,
  ): Promise<{ message: 'ok'; statuscode: 200 }> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    let time: any = Request.headers.time || 60;
    // console.log('Request_headers_secretkey=>'+secretkey);
    // console.log('SECRET_KEY=>'+process.env.SECRET_KEY);
    // console.log('Request_headers_time=>'+time);
    const keycache: any = caseModel.keycache;
    const otpvalidate: any = caseModel.otpvalidate;
    // console.log('keycache=>'+keycache);
    // console.log('otpvalidate=>'+otpvalidate);
    // if (secretkey != process.env.SECRET_KEY) {
    //   res.status(200).json({
    //     statuscode: 200,
    //     SECRET_KEY: process.env.SECRET_KEY,
    //     message: 'Forbidden! SKEY is not valid . ',
    //   });
    // }
    // console.info('keycache', keycache);
    // console.info('otpvalidate', otpvalidate);
    var input: any = {
      keycache: keycache,
      otpvalidate: otpvalidate,
    };
    var otp: any = await Cache.validateOTP(input);
    if (otp) {
      res.status(200).json({
        statuscode: 200,
        message: 'OK',
        message_th: 'OTP',
        code: otp,
        payload: otp,
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        message: 'OTP expire',
        message_th: 'OTP หมดอายุ',
        code: otp,
        payload: null,
      });
      return;
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signinotp')
  @ApiOperation({ summary: 'Signin OTP.' })
  async SigninOTP(
    @Req() Req,
    @Res() res: Response,
    @Body(new ValidationPipe()) auth: UserAuthModel,
  ): Promise<string> {
    // console.log('login user =>')
    // console.info(auth)
    const data: any = await this.authService.authenticate(auth);
    //console.log('login data=>'); console.info(data);
    var loginfailed: number = data.loginfailed;
    if (data.uid && loginfailed >= 10) {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        message: 'This is user Locked please contact admin..',
        message_th: 'ผู้ใช้นี้ถูกล็อค กรุณาติดต่อผู้ดูแลระบบ..',
        payload: null,
      });
      return;
    }
    if (!data.uid) {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        message: 'Sign in failed!',
        message_th: 'เข้าระบบไม่สำเร็จ กรุณาลองใหม่..',
        payload: null,
      });
      return;
    }
    if (data.uid) {
      let checkUserActive: any = await this.userService.checkUserActive(
        data.uid,
      );
      if (checkUserActive < 1) {
        res.status(200).json({
          statusCode: 200,
          code: 403,
          message: 'This account Inactive status.',
          message_th: 'บัญชีนี้ ไม่อยู่ในสถานะ พร้อมใช้งาน.',
          payload: null,
        });
        return;
      }
      let secretkey: any = Req.headers.secretkey;
      let time: Number = Number(Req.headers.time) || 300;
      // console.log('Request_headers_secretkey=>'+secretkey);
      // console.log('SECRET_KEY=>'+process.env.SECRET_KEY);
      // console.log('Request_headers_time=>'+time);
      const Randomint: any = format.getRandomint(6);
      //const otpot :any= await Cache.OTPTIME(Randomint,time);
      const otpot: any = await Cache.OTPTIMEUSER(
        Randomint,
        time,
        data.uid,
        data.email,
        data.username,
        data.token,
        data.roleId,
      );
      const keycache: any = otpot.key;
      const otpvalidate: number = otpot.OTP.otp;
      // console.log('otpot==>'); console.info(otpot);
      var inputOTP: any = { keycache: keycache, otpvalidate: otpvalidate };
      const inputOTPa: any = await Cache.validateGetUser(inputOTP);
      //  console.log('inputOTPa==>'); console.info(inputOTPa);
      //  const inputOTPs = JSON.parse(inputOTPa);
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Sign In OTP',
        message_th: 'กรุณาตรวจสอบ OTP.',
        //,inputOTPs:inputOTPa
        //, otpot: otpot
        //, data: data
        payload: {
          key: otpot.key,
          time: otpot.time,
          otp: otpot.OTP.otp,
          //,uid: otpot.OTP.uid
          //,token: otpot.OTP.token
        },
        // , validateOTP:inputOTPa
      });
      return;
    }

    // let DataUpdate:any={}
    // DataUpdate.id = data.uid;
    // const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
    // const updateddate =  moment(new Date(), DATE_TIME_FORMAT);
    // DataUpdate.lastsignindate =Date();
    // await this.userService.updateSdUser(DataUpdate);
    // res.status(200).json({
    //     statusCode: 200,
    //     code: 200,
    //     message: 'Sign In Successful.',
    //     message_th: 'เข้าระบบสำเร็จ.',
    //     payload: data,
    // });
    // return
  }

  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'This Redis.' })
  @Post('/verifyuserotp')
  async verifyUserOTP(
    @Req() Request,
    @Res() res: Response,
    @Body(new ValidationPipe()) caseModel: otpverifyDto,
  ): Promise<{ message: 'ok'; statuscode: 200 }> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    let time: any = Request.headers.time || 60;
    // console.log('Request_headers_secretkey=>'+secretkey);
    // console.log('SECRET_KEY=>'+process.env.SECRET_KEY);
    // console.log('Request_headers_time=>'+time);
    const keycache: any = caseModel.otpkey;
    const otpvalidate: any = caseModel.otp;
    // console.log('keycache=>'+keycache);
    // console.log('otpvalidate=>'+otpvalidate);
    // if (secretkey != process.env.SECRET_KEY) {
    //   res.status(200).json({
    //     statuscode: 200,
    //     message: 'Forbidden! SKEY is not valid . ',
    //   });
    // }
    // console.info('keycache', keycache);
    // console.info('otpvalidate', otpvalidate);
    var input: any = {
      keycache: keycache,
      otpvalidate: otpvalidate,
    };
    var otp: any = await Cache.validateGetUser(input);
    if (otp) {
      res.status(200).json({
        statuscode: 200,
        code: 200,
        message: 'Success',
        message_th: 'Verify OTP Successful',
        payload: otp,
      });
      return;
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 422,
        message: 'OTP is invalid or OTP expire.',
        message_th: 'OTP ไม่ถูกต้อง หรือ OTP หมดอายุ.',
        payload: null,
      });
      return;
    }
  }
}
