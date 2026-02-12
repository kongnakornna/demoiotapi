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
  DefaultValuePipe,
  ParseIntPipe,
  ParseFilePipeBuilder,
  UploadedFile,
  UseInterceptors,
  PipeTransform,
  ArgumentMetadata,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express, Request, Response, NextFunction } from 'express';
import { Public } from '@src/modules/auth/auth.decorator';
var moment = require('moment');
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  AuthUserRequired,
  auth,
  AuthTokenRequired,
} from '@src/modules/auth/auth.decorator';
import { AuthService } from '@src/modules/auth/auth.service';
import { User } from '@src/modules/users/entities/user.entity';
import { UsersService } from '@src/modules/users/users.service';
// import * as cache from '@src/utils/cache/redis.cache';
import * as rediscluster from '@src/utils/cache/rediscluster.cache';
import { CacheDataOne } from '@src/utils/cache/redis.cache';
var Cache = new CacheDataOne();
import 'dotenv/config';
require('dotenv').config();
const API_VERSION = '1';
import * as argon2 from 'argon2';
//console.log('SECRET_KEY: '+process.env.SECRET_KEY)
import { JwtService } from '@nestjs/jwt';
import * as format from '@src/helpers/format.helper';
import { AuthGuard } from '@src/modules/auth/auth.guard';
import { AuthGuardUser } from '@src/modules/auth/auth.guarduser';
import { passwordtDto } from '@src/modules/users/dto/Resetpassword.dto';
import { fileDto } from '@src/modules/users/dto/file.dto';
import { FogotPassword } from '@src/modules/users/dto/forgeot-password.dto';
const { passwordStrength } = require('check-password-strength');
import { Pagination } from 'nestjs-typeorm-paginate';
// passwordStrength('asdf1234').value)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)  
  @ApiOperation({ summary: 'Retrieves the authorized user' })
  @Get('me')
  async Me(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<User> {
    //console.log('req.user')
    //console.info(req.user)
    const proFile = {
      uid: req.user.id,
      userCreatedatd: req.user.createddate,
      username: req.user.username,
      email: req.user.email,
      status: req.user.status,
      usertype: req.user.usertype,
      type: req.user.type,
    };
    const status: any = req.user.status;
    if (status == 0 || status == false) {
      var result: any = {
        statuscode: 200,
        message:
          'Forbidden! This username: ' +
          req.user.username +
          ' Email: ' +
          req.user.email +
          ' Inactive',
        payload: null,
      };
      res.status(200).json(result);
      return;
    } else {
      let jwt = req.headers.authorization.replace('Bearer ', '');
      const token = req.headers.authorization.replace('Bearer ', '').trim();
      //console.log("token=>"+token)
      let jsonString: any = this.jwtService.decode(token) as { id: string };
      //console.info("jsonString=>"+jsonString)
      let idx = jsonString.id;
      await this.authService.checkRefreshToken(idx);
      var decoded: any = {};
      var decoded: any = this.jwtService.decode(token);
      var iat = decoded.iat * 1000;
      var exp = decoded.exp * 1000;
      var d1 = new Date(iat);
      var d2 = new Date(exp);
      var EXPIRE_TIME = Number(exp - iat);
      var TokenDate: any = {
        //signin: iat,
        //expires: exp,
        //EXPIRE_TIME: EXPIRE_TIME,
        EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
        signin_date: format.timeConvertermas(d1),
        expires_date: format.timeConvertermas(d2),
        token: jwt,
      };
      const Profiles: any = await this.usersService.getProfile(idx);
      const Profile: any = Profiles[0];
      const lastsignindates: any = format.convertTZ(
        Profile.lastsignindate,
        process.env.tzString,
      );
      const lastsignindate2: any = format.timeConvertermas(lastsignindates);
      const lastsignindate: any = format.timeConvertermas(
        format.convertTZ(Profile.lastsignindate, process.env.tzString),
      );
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
        lastsignindate: lastsignindate,
        //  status:Profile.status,
        //  active_status:Profile.active_status,
        network_id: Profile.network_id,
        //  remark:Profile.remark,
        infomation_agree_status: Profile.infomation_agree_status,
        gender: Profile.gender,
        birthday: Profile.birthday,
        online_status: Profile.online_status,
        message: Profile.message,
        //  network_type_id:Profile.network_type_id,
        //  public_status:Profile.public_status,
        type_id: Profile.type_id,
        avatarpath: Profile.avatarpath,
        avatar: Profile.avatar,
        loginfailed: Profile.loginfailed,
        refresh_token: Profile.refresh_token, 
        system_id: Profile.system_id,
        location_id: Profile.location_id, 
        createddate: format.timeConvertermas(
          format.convertTZ(Profile.createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(Profile.updateddate, process.env.tzString),
        ),
        deletedate: format.timeConvertermas(
          format.convertTZ(Profile.createddate, process.env.tzString),
        ),
      };

      var result: any = {
        statuscode: 200,
        message: 'proFile',
        payload: ProfileRs,
        tokenInfo: TokenDate,
      };
      res.status(200).json(result);
      return;
    }
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'user paginate' })
  @Get('paginate')
  async paginate(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Req() req: any,
  ): Promise<Pagination<User>> {
    {
      limit = limit > 100 ? 100 : limit;
      return await this.usersService.paginate({
        page,
        limit,
        route: 'http://127.0.0.1/v1/user/paginate',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  uploadFile(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
    @Body() body: fileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log('file: ' + file);
    return {
      body,
      file: file.buffer.toString(),
    };
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @UseInterceptors(FileInterceptor('file'))
  @Post('file/pass-validation')
  uploadFileAndPassValidation(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
    @Body() body: fileDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: 'image/jpeg' }),
        ],
      }),
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpeg',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file?.buffer.toString(),
    };
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @UseInterceptors(FileInterceptor('file'))
  @Post('file/fail-validation')
  uploadFileAndFailValidation(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
    @Body() body: fileDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'png',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'list User' })
  @Get('list')
  async listUser(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<any> {
    const page: number = Number(query.page) || 1;
    const pageSize: number = Number(query.pageSize) || 20;
    var status: any = query.status || '';
    let active_status: any = query.active || '';
    var sort: any = query.sort || 'createddate-ASC';
    let keyword: any = query.keyword || '';
    let filter: any = {};
    filter.sort = sort;
    filter.keyword = keyword;
    filter.status = status;
    filter.active_status = active_status;
    filter.isCount = 1;
    let rowResultData: any = await this.usersService.listpaginateAdmin(filter);
    const rowData: any = Number(rowResultData);
    const totalPages: number = Math.round(rowData / pageSize) || 1;
    let filter2: any = {};
    filter2.sort = sort;
    filter2.keyword = keyword;
    filter2.status = status;
    filter2.active_status = active_status;
    filter2.page = page;
    filter2.pageSize = pageSize;
    filter2.isCount = 0;
    console.log(`filter2=`);
    console.info(filter2);
    let ResultData: any = await this.usersService.listpaginateAdmin(filter2);
    let tempData = [];
    let tempDataoid = [];
    let tempData2 = [];
    for (const [key, va] of Object.entries(ResultData)) {
      // เอาค่าใน Object มา แปลง เป็น array แล้วนำไปใช้งาน ต่อ
      const uid: string = ResultData[key].uid || null;
      const lastsignindates: any = format.convertTZ(
        ResultData[key].lastsignindate,
        process.env.tzString,
      );
      const lastsignindate2: any = format.timeConvertermas(lastsignindates);
      const lastsignindate: any = format.timeConvertermas(
        format.convertTZ(ResultData[key].lastsignindate, process.env.tzString),
      );
      const ProfileRs: any = {
        uid: ResultData[key].uid,
        role_id: ResultData[key].role_id,
        email: ResultData[key].email,
        username: ResultData[key].username,
        firstname: ResultData[key].firstname,
        lastname: ResultData[key].lastname,
        fullname: ResultData[key].fullname,
        nickname: ResultData[key].nickname,
        idcard: ResultData[key].idcard,
        lastsignindate: lastsignindate,
        status: ResultData[key].status,
        active_status: ResultData[key].active_status,
        network_id: ResultData[key].network_id,
        remark: ResultData[key].remark,
        infomation_agree_status: ResultData[key].infomation_agree_status,
        gender: ResultData[key].gender,
        birthday: ResultData[key].birthday,
        online_status: ResultData[key].online_status,
        message: ResultData[key].message,
        network_type_id: ResultData[key].network_type_id,
        public_status: ResultData[key].public_status,
        type_id: ResultData[key].type_id,
        avatarpath: ResultData[key].avatarpath,
        avatar: ResultData[key].avatar,
        loginfailed: ResultData[key].loginfailed,
        refresh_token: ResultData[key].refresh_token,
        mobile_number: ResultData[key].mobile_number,
        lineid: ResultData[key].lineid,
        public_notification: ResultData[key].public_notification,
        sms_notification: ResultData[key].sms_notification,
        email_notification: ResultData[key].email_notification,
        line_notification: ResultData[key].line_notification,
        phone_number: ResultData[key].phone_number,
        rolename: ResultData[key].rolename,
        role_type_id: ResultData[key].role_type_id,
        permision_name: ResultData[key].permision_name,
        permision_detail: ResultData[key].permision_detail,
        permision_created: ResultData[key].permision_created,
        permision_updated: ResultData[key].permision_updated,
        permision_insert: ResultData[key].permision_insert,
        permision_update: ResultData[key].permision_update,
        permision_delete: ResultData[key].permision_delete,
        permision_select: ResultData[key].permision_select,
        permision_log: ResultData[key].permision_log,
        permision_config: ResultData[key].permision_config,
        permision_truncate: ResultData[key].permision_truncate, 
        system_id:ResultData[key].system_id, 
        location_id:ResultData[key].location_id,  
        createddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(ResultData[key].updateddate, process.env.tzString),
        ),
        deletedate: format.timeConvertermas(
          format.convertTZ(ResultData[key].createddate, process.env.tzString),
        ),
      };
      tempDataoid.push(uid);
      tempData.push(va);
      tempData2.push(ProfileRs);
    }
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: {
        page: page,
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        total: rowData,
        filter2: filter2,
        data: tempData2,
      },
      message: 'success.',
      message_th: 'success.',
    });
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Retrieves the authorized user' })
  @Get('deleteprofile')
  async deleteprofile(
    @Res() res: Response, 
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('query');
    console.info(query);
    let jwt = req.headers.authorization.replace('Bearer ', '');
    const token = req.headers.authorization.replace('Bearer ', '').trim();
    console.log('token=>' + token);
    let jsonString: any = this.jwtService.decode(token) as { id: string };
    //console.info("jsonString=>"+jsonString)
    //const idxs:number=   parseInt( dto.idx);
    var uid: any = query.uid;
    if (!uid) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'uid is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }else {  
      const Profiles: any = await this.usersService.chkProfile(uid);
      if (!Profiles) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: null,
          message: 'uid is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      if(Profiles){
          await this.usersService.deleteUser(uid);
          res.status(200).json({
            statusCode: 200,
            code: 200,
            uid: uid,
            payload: null, 
            message: 'This User is deleted complete.',
            message_th: 'ผู้ใช้รายนี้ถูกลบออกเรียบร้อยแล้ว',
          });

      }else{
        res.status(200).json({
            statusCode: 200,
            code: 400,
            uid: uid,
            payload: null, 
            message: 'This User not in database.',
            message_th: 'ผู้ใช้นี้ไม่มีอยู่ในฐานข้อมูล',
          });
      } 
      
    }
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Retrieves the authorized user' })
  @Get('profiledetail')
  async profiledetail(
      @Res() res: Response, 
      @Body() dto: any,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
    ) {
    console.log('query');
    console.info(query);
    let jwt = req.headers.authorization.replace('Bearer ', '');
    const token = req.headers.authorization.replace('Bearer ', '').trim();
    console.log('token=>' + token);
    let jsonString: any = this.jwtService.decode(token) as { id: string };
    console.log('Get req.user');
    console.info(req.user);
    const uid:any =  query.uid;
    const status: any = req.user.status;
    if (!uid) { 
        res.status(200).json({
          statuscode: 404
          , message: 'This user is not found.'
          , message_th: 'ไม่พบผู้ใช้รายนี้!'
          , payload: null
      });
    } else { 
      const Profiles: any = await this.usersService.getProfile(uid);
      const Profile: any = Profiles[0];
      const lastsignindates: any = format.convertTZ(
        Profile.lastsignindate,
        process.env.tzString,
      );
      const lastsignindate2: any = format.timeConvertermas(lastsignindates);
      const lastsignindate: any = format.timeConvertermas(
        format.convertTZ(Profile.lastsignindate, process.env.tzString),
      );
      if (Profile.birthday) {
        var birthday: any = format.timeConvertermas(
          format.convertTZ(Profile.birthday, process.env.tzString),
        );
      } else {
        var birthday: any = Profile.birthday;
      }
      const ProfileRs: any = {
        uid: Profile.uid,
        role_id: Profile.roleid,
        role_type_id: Profile.role_type_id,
        rolename: Profile.rolename,
        email: Profile.email,
        username: Profile.username,
        firstname: Profile.firstname,
        lastname: Profile.lastname,
        fullname: Profile.fullname,
        nickname: Profile.nickname,
        idcard: Profile.idcard,
        lastsignindate: lastsignindate,
        status: Profile.status,
        active_status: Profile.active_status,
        network_id: Profile.network_id,
        remark: Profile.remark,
        infomation_agree_status: Profile.infomation_agree_status,
        gender: Profile.gender,
        birthday: birthday,
        online_status: Profile.online_status,
        message: Profile.message,
        network_type_id: Profile.network_type_id,
        public_status: Profile.public_status,
        type_id: Profile.type_id,
        avatarpath: Profile.avatarpath,
        avatar: Profile.avatar,
        loginfailed: Profile.loginfailed,
        refresh_token: Profile.refresh_token,  
        permision_name:Profile.permision_name,
        permision_detail:Profile.permision_detail,
        // permision_created:Profile.permision_created,
        // permision_updated:Profile.permision_updated,
        permision_insert:Profile.permision_insert,
        permision_update:Profile.permision_update,
        permision_delete:Profile. permision_delete,
        permision_select:Profile.permision_select,
        permision_log:Profile.permision_log,
        permision_config:Profile.permision_config,
        permision_truncate:Profile.permision_truncate, 
        public_notification:Profile.public_notification, 
        sms_notification:Profile.sms_notification, 
        email_notification:Profile.email_notification, 
        line_notification:Profile.line_notification, 
        lineid:Profile.lineid, 
        mobile_number:Profile.mobile_number, 
        phone_number:Profile.phone_number, 
        system_id:Profile.system_id, 
        location_id:Profile.location_id,  
        createddate: format.timeConvertermas(
          format.convertTZ(Profile.createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(Profile.updateddate, process.env.tzString),
        ),
        deletedate: format.timeConvertermas(
          format.convertTZ(Profile.createddate, process.env.tzString),
        ),
      }; 
      res.status(200).json({
        statusCode: 200,
        code: 200,
        uid: uid,
        payload: ProfileRs, 
        message: 'Profile load data success.',
        message_th: 'โหลดข้อมูลโปรไฟล์สำเร็จ.',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Retrieves the authorized user' })
  @Get('profile')
  async Profile(
    @Res() res: Response,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<User> {
    console.log('Get req.user');
    console.info(req.user);
    const proFile = {
      uid: req.user.id,
      username: req.user.username,
      email: req.user.email,
      status: req.user.status,
      usertype: req.user.usertype,
      type: req.user.type,
    };
    const status: any = req.user.status;
    if (status == 0 || status == false) {
      var result: any = {
        statuscode: 200,
        message:
          'Forbidden! This username: ' +
          req.user.username +
          ' Email: ' +
          req.user.email +
          ' Inactive',
        payload: null,
      };
      return result;
      //   res.status(200).json({
      //     statuscode: 200
      //     , message: "Forbidden! This username: "+req.user.username+" Email: "+req.user.email+" Inactive"
      //     , payload: null
      // });
    } else {
      // console.log('proFile =>')
      // console.info(proFile)
      let jwt: any = req.headers.authorization.replace('Bearer ', '');
      const token: any = req.headers.authorization
        .replace('Bearer ', '')
        .trim();
      //console.log("token=>"+token)
      let jsonString: any = this.jwtService.decode(token) as { id: string };
      //console.info("jsonString=>"+jsonString)
      let idx = jsonString.id;
      await this.authService.checkRefreshToken(idx);
      var decoded: any = {};
      var decoded: any = this.jwtService.decode(token);
      var iat = decoded.iat * 1000;
      var exp = decoded.exp * 1000;
      var d1 = new Date(iat);
      var d2 = new Date(exp);
      var EXPIRE_TIME = Number(exp - iat);
      var TokenDate: any = {
        //signin: iat,
        //expires: exp,
        //EXPIRE_TIME: EXPIRE_TIME,
        EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
        signin_date: format.timeConvertermas(d1),
        expires_date: format.timeConvertermas(d2),
        token: jwt,
      };
      const Profiles: any = await this.usersService.getProfile(idx);
      const Profile: any = Profiles[0];
      const lastsignindates: any = format.convertTZ(
        Profile.lastsignindate,
        process.env.tzString,
      );
      const lastsignindate2: any = format.timeConvertermas(lastsignindates);
      const lastsignindate: any = format.timeConvertermas(
        format.convertTZ(Profile.lastsignindate, process.env.tzString),
      );
      if (Profile.birthday) {
        var birthday: any = format.timeConvertermas(
          format.convertTZ(Profile.birthday, process.env.tzString),
        );
      } else {
        var birthday: any = Profile.birthday;
      }
      const ProfileRs: any = {
        uid: Profile.uid,
        role_id: Profile.roleid,
        role_type_id: Profile.role_type_id,
        rolename: Profile.rolename,
        email: Profile.email,
        username: Profile.username,
        firstname: Profile.firstname,
        lastname: Profile.lastname,
        fullname: Profile.fullname,
        nickname: Profile.nickname,
        idcard: Profile.idcard,
        lastsignindate: lastsignindate,
        status: Profile.status,
        active_status: Profile.active_status,
        network_id: Profile.network_id,
        remark: Profile.remark,
        infomation_agree_status: Profile.infomation_agree_status,
        gender: Profile.gender,
        birthday: birthday,
        online_status: Profile.online_status,
        message: Profile.message,
        network_type_id: Profile.network_type_id,
        public_status: Profile.public_status,
        type_id: Profile.type_id,
        avatarpath: Profile.avatarpath,
        avatar: Profile.avatar,
        loginfailed: Profile.loginfailed,
        refresh_token: Profile.refresh_token,  
        permision_name:Profile.permision_name,
        permision_detail:Profile.permision_detail,
        // permision_created:Profile.permision_created,
        // permision_updated:Profile.permision_updated,
        permision_insert:Profile.permision_insert,
        permision_update:Profile.permision_update,
        permision_delete:Profile. permision_delete,
        permision_select:Profile.permision_select,
        permision_log:Profile.permision_log,
        permision_config:Profile.permision_config,
        permision_truncate:Profile.permision_truncate, 
        public_notification:Profile.public_notification, 
        sms_notification:Profile.sms_notification, 
        email_notification:Profile.email_notification, 
        line_notification:Profile.line_notification, 
        lineid:Profile.lineid, 
        mobile_number:Profile.mobile_number, 
        phone_number:Profile.phone_number, 
        system_id:Profile.system_id, 
        location_id:Profile.location_id,  
        createddate: format.timeConvertermas(
          format.convertTZ(Profile.createddate, process.env.tzString),
        ),
        updateddate: format.timeConvertermas(
          format.convertTZ(Profile.updateddate, process.env.tzString),
        ),
        deletedate: format.timeConvertermas(
          format.convertTZ(Profile.createddate, process.env.tzString),
        ),
      };
      // var result:any ={
      //     statuscode: 200
      //     , message: "Profile"
      //     , payload:  ProfileRs
      //     , tokenInfo:TokenDate
      // }
      // return result;
      res.status(200).json({
        statusCode: 200,
        code: 200,
        uid: idx,
        payload: ProfileRs,
        tokenInfo: TokenDate,
        message: 'success.',
        message_th: 'success.',
      });
    }
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Retrieves the authorized user' })
  @Post('profiles')
  async ProfilePost(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<User> {
    console.log('Post req');
    console.info(req);
    const status: any = req.user.status;
    if (status == 0 || status == false) {
      var result: any = {
        statuscode: 200,
        message:
          'Forbidden! This username: ' +
          req.user.username +
          ' Email: ' +
          req.user.email +
          ' Inactive',
        payload: null,
      };
      res.status(200).json(result);
      return;
    } else {
      // console.log('proFile =>')
      // console.info(proFile)
      let jwt = req.headers.authorization.replace('Bearer ', '');
      const token = req.headers.authorization.replace('Bearer ', '').trim();
      console.log('token=>' + token);
      let jsonString: any = this.jwtService.decode(token) as { id: string };
      //console.info("jsonString=>"+jsonString)
      let idx = jsonString.id;
      await this.authService.checkRefreshToken(idx);
      var decoded: any = {};
      var decoded: any = this.jwtService.decode(token);
      var iat = decoded.iat * 1000;
      var exp = decoded.exp * 1000;
      var d1 = new Date(iat);
      var d2 = new Date(exp);
      var EXPIRE_TIME = Number(exp - iat);
      var TokenDate: any = {
        //signin: iat,
        //expires: exp,
        //EXPIRE_TIME: EXPIRE_TIME,
        EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
        signin_date: format.timeConvertermas(d1),
        expires_date: format.timeConvertermas(d2),
        token: jwt,
      };
      const Profiles: any = await this.usersService.getProfile(idx);
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
        createddate: Profile.createddate,
        updateddate: Profile.updateddate,
        deletedate: Profile.deletedate,
        loginfailed: Profile.loginfailed,
        public_notification:Profile.public_notification, 
        sms_notification:Profile.sms_notification, 
        email_notification:Profile.email_notification, 
        line_notification:Profile.line_notification, 
        lineid:Profile.lineid, 
        mobile_number:Profile.mobile_number, 
        phone_number:Profile.phone_number,  
        system_id:Profile.system_id, 
        location_id:Profile.location_id,  
      };
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: ProfileRs,
        tokenInfo: TokenDate,
        message: 'Profile.',
        message_th: 'Profile.',
      };
      // return result;
      // console.log('result =>'); console.info(result);
      res.status(200).json(result);
    }
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'Retrieves the authorized user' })
  @Post('updateprofile')
  async updateProfile(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    // console.log('Post req');
    // console.info(req);
    let jwt = req.headers.authorization.replace('Bearer ', '');
    const token = req.headers.authorization.replace('Bearer ', '').trim();
    console.log('token=>' + token);
    let jsonString: any = this.jwtService.decode(token) as { id: string };
    //console.info("jsonString=>"+jsonString)
    //const idxs:number=   parseInt( dto.idx);
    if (!dto) {
      res.status(200).json({
        statusCode: 200,
        code: 422,
        payload: null,
        message: 'Data is null.',
        message_th: 'ไม่พบข้อมูล.',
      });
      return;
    }

    const uid: string = dto.uid;
    const email: any = dto.email;
    const username: any = dto.username;
    console.log('email=> ' + email);
    console.log('username=> ' + username);
    if (!uid) {
      const uid: string = '0';
      var result: any = {
        statusCode: 200,
        code: 404,
        payload: null,
        message: 'uid ' + uid + ' is null.',
        message_th: 'ไม่พบข้อมูล uid ' + uid + '.',
      };
      res.status(200).json(result);
    }
    if (email) {
      console.log('if email=> ' + email);
      const emailExists: any = await this.usersService.findByEmail(email);
      if (emailExists) {
        console.log('emailExists=>' + emailExists.email);
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: { email: emailExists.email },
          message: 'The email duplicate this data cannot update.',
          message_th: 'ข้อมูลซ้ำนี้ไม่สามารถ แก้ไขข้อมูล ได้.',
        });
        return;
      }
    }
    if (username) {
      console.log('if username=> ' + username);
      const usernameRs: any = await this.usersService.getUserByusername(
        username,
      );
      if (usernameRs) {
        console.log('username=>' + usernameRs.username);
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: { username: usernameRs.username },
          message: 'The username duplicate this data cannot update.',
          message_th: 'ข้อมูลซ้ำนี้ไม่สามารถ แก้ไขข้อมูล ได้.',
        });
        return;
      }
    }
    let DataUpdate: any = {};
    DataUpdate.id = uid;
    if (dto.role_id) {
      DataUpdate.role_id = dto.role_id;
    }
    if (email) {
      DataUpdate.email = email;
    }
    if (username) {
      DataUpdate.username = username;
    }
    if (dto.password!=dto.confirm_password) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        code: 400,
        payload: dto,
        message: 'Password and Confirm Password do not match..',
        message_th: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน.',
      });
      return;
    } 
    if(dto.password){
       /*******************/
        const password_val: any = passwordStrength(dto.password).value; 
        if (password_val === 'Weak') {
          res.status(200).json({
            statusCode: 200,
            code: 400,
            payload: null,
            message: 'Password is ' + password_val + ' please change it for security.',
            message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
          });
          return;
        }
        if (password_val === 'Medium') {
          res.status(200).json({
            statusCode: 200,
            code: 400,
            payload: null,
            message: 'Password is ' + password_val + ' please change it for security.',
            message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
          });
          return;
        }
       /******************/
      
    }
    if (dto.password) {
      DataUpdate.password = dto.password;
    }
    if (dto.password) {
      DataUpdate.password_temp = dto.password;
    }
    if (dto.firstname) {
      DataUpdate.firstname = dto.firstname;
    }
    if (dto.lastname) {
      DataUpdate.lastname = dto.lastname;
    }
    if (dto.fullname) {
      DataUpdate.fullname = dto.fullname;
    }
    if (dto.nickname) {
      DataUpdate.nickname = dto.nickname;
    }
    if (dto.idcard) {
      DataUpdate.idcard = dto.idcard;
    }
    if (dto.lastsignindate) {
      //DataUpdate.lastsignindate =dto.lastsignindate;
      DataUpdate.lastsignindate = Date();
    }
    if (dto.status) {
      DataUpdate.status = dto.status;
    }
    if (dto.active_status) {
      DataUpdate.active_status = dto.active_status;
    }
    if (dto.network_id) {
      DataUpdate.network_id = dto.network_id;
    }
    if (dto.remark) {
      DataUpdate.remark = dto.remark;
    }
    if (dto.infomation_agree_status) {
      DataUpdate.infomation_agree_status = dto.infomation_agree_status;
    }
    if (dto.gender) {
      DataUpdate.gender = dto.gender;
    }
    if (dto.birthday) {
      DataUpdate.birthday = dto.birthday;
    }
    if (dto.online_status) {
      DataUpdate.online_status = dto.online_status;
    }
    if (dto.message) {
      DataUpdate.message = dto.message;
    }
    if (dto.network_type_id) {
      DataUpdate.network_type_id = dto.network_type_id;
    }
    if (dto.public_status) {
      DataUpdate.public_status = dto.public_status;
    }
    if (dto.type_id) {
      DataUpdate.type_id = dto.type_id;
    }
    if (dto.avatarpath) {
      DataUpdate.avatar = dto.avatarpath;
    }
    if (dto.avatar) {
      DataUpdate.avatar = dto.avatar;
    }
    if (dto.refresh_token) {
      DataUpdate.refresh_token = dto.refresh_token;
    }
    if (dto.createddate) {
      DataUpdate.createddate = dto.createddate;
    }
    if (dto.deletedate) {
      DataUpdate.deletedate = dto.deletedate;
    }
    if (dto.loginfailed) {
      DataUpdate.loginfailed = dto.loginfailed;
    }
    
    if (dto.public_notification) {
        DataUpdate.public_notification = dto.public_notification;
    }

    if (dto.sms_notification) {
        DataUpdate.sms_notification = dto.sms_notification;
    }

    if (dto.email_notification) {
          DataUpdate.email_notification = dto.email_notification;
    }

    if (dto.mobile_number) {
          DataUpdate.mobile_number = dto.mobile_number;
    }

    if (dto.phone_number) {
          DataUpdate.phone_number = dto.phone_number;
    }

    if (dto.line_notification) {
        DataUpdate.line_notification = dto.line_notification;
    }

    if (dto.lineid) {
        DataUpdate.lineid = dto.lineid;
    }
    if (dto.system_id) {
        DataUpdate.system_id = dto.system_id;
    }
    if (dto.location_id) {
        DataUpdate.location_id = dto.location_id;
    }
    console.log(`DataUpdate=>`);
    console.info(DataUpdate);
    const rt: any = await this.usersService.updateSdUser(DataUpdate);
    if (rt && rt == 200) {
      var result: any = {
        statusCode: 200,
        code: 200,
        payload: DataUpdate,
        rt: rt,
        message: 'Profile update successful.',
        message_th: 'อัปเดตโปรไฟล์ สำเร็จ.',
      };
      res.status(200).json(result);
    } else {
      var result: any = {
        statusCode: 200,
        code: 422,
        payload: DataUpdate,
        rt: rt,
        message: 'Profile update Unsuccessful',
        message_th: 'อัปเดตโปรไฟล์ ไม่สำเร็จ',
      };
      res.status(200).json(result);
    }
  }

  @HttpCode(200)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @ApiOperation({ summary: 'update mqtt status' })
  @Post('updatestatus')
  async update_status(
      @Res() res: Response,
      @Body() dto: any,
      @Query() query: any,
      @Headers() headers: any,
      @Param() params: any,
      @Req() req: any,
     ) { 
      //console.log('Post req');  console.info(req);
      // console.log(`dto=>`); console.info(dto);
      let jwt = req.headers.authorization.replace('Bearer ', '');
      const token = req.headers.authorization.replace('Bearer ', '').trim();
      // console.log('token=>' + token);
      let jsonString: any = this.jwtService.decode(token) as { id: string };
      // console.info("jsonString=>"+jsonString) 
      if (!dto) {
        res.status(200).json({
          statusCode: 200,
          code: 422,
          payload: dto,
          message: 'Data is null.',
          message_th: 'ไม่พบข้อมูล.',
        });
        return;
      }
      var uid: number = dto.uid;  
      if (uid==null) { 
        var result: any = {
          statusCode: 200,
          code: 404,
          payload: dto,
          message: ' uid ' + uid + ' is null.',
          message_th: 'ไม่พบข้อมูล  uid ' + uid + '.',
        };
        res.status(200).json(result);
      } 
      var active_status: number = dto.active_status; 
      if (active_status==null) {
        var result: any = {
          statusCode: 200,
          code: 404,
          payload: dto,
          message: ' active_status ' + active_status + ' is null.',
          message_th: 'ไม่พบข้อมูล  active_status ' + active_status + '.',
        };
        res.status(200).json(result);
      }  
      var rt: any = await this.usersService.update_user_status(uid,active_status); 
      if (rt) {
          var result: any = {
                statusCode: 200,
                code: 200,  
                payload: rt,  
                message: 'Update successful.',
                message_th: 'อัปเดต  สำเร็จ.',
          };
          res.status(200).json(result);
      } else {
          var result: any = {
              statusCode: 200,
              code: 422,
              payload: rt, 
              message: 'Update Unsuccessful',
              message_th: 'อัปเดต ไม่สำเร็จ',
          };
        res.status(200).json(result);
      }
    }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Get('/verifyemail')
  async verifyresetpaas(
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
    @Req() Request,
    @Res() res: Response,
    @Param() Param: string,
  ): Promise<User> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    //  console.log('Request_headers_secretkey=>'+secretkey)
    //  console.info('SECRET_KEY=>'+process.env.SECRET_KEY)
    //console.info('process.env>'+process.env)
    // console.log('proFile =>')
    // console.info(proFile)
    let token = Request.headers.authorization.replace('Bearer ', '');
    //console.log("jwt=>"+jwt)
    let jsonString: any = this.jwtService.decode(token) as { id: string };
    //console.info("jsonString=>"+jsonString)
    let idx = jsonString.id;
    const Profiles: any = await this.usersService.getProfile(idx);
    if (!Profiles) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        payload: null,
        message: 'Data not found in system.',
        message_th: 'ไม่พบข้อมูลในระบบ.',
      });
      return;
    }
    const Profile: any = Profiles[0];
    res.status(200).json({
      statusCode: 200,
      payload: {
        uid: Profile.uid,
        email: Profile.email,
        token: token,
      },
      message: 'Verify User.',
      message_th: 'Verify User.',
    });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  //@UseGuards(AuthGuardUser)
  @Post('/resetpassword')
  async ResetSystem(
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
    @Req() Request,
    @Res() res: Response,
    @Body() Reset: any,
  ): Promise<User> {
    // console.info(Request.headers)
    // Request.headers.secretkey
    let secretkey: any = Request.headers.secretkey;
    //  console.log('Request_headers_secretkey=>'+secretkey)
    //  console.info('SECRET_KEY=>'+process.env.SECRET_KEY)
    //console.info('process.env>'+process.env)
    // console.log('proFile =>')
    // console.info(proFile)
    console.log('Reset =>')
    console.info(Reset)
    let token = Request.headers.authorization.replace('Bearer ', '');
    //console.log("jwt=>"+jwt)
    let jsonString: any = this.jwtService.decode(token) as { id: string };
    //console.info("jsonString=>"+jsonString)
    let idx = jsonString.id;
    await this.authService.checkRefreshToken(idx);
    if (!Reset) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        code: 400,
        payload: Reset,
        message: 'Data not found in system.',
        message_th: 'ไม่พบข้อมูลในระบบ.',
      });
      return;
    }
    // generateTokenUser(ids: any,expires:any)
    let passwords: any = Reset.password;
    let passwords_update: any = Reset.password;
    let confirm_passwords: any = Reset.confirm_password;
    if (!passwords_update) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        code: 400,
        payload: Reset,
        message: 'password is null.',
        message_th: 'กรุณา กำหนดค่า รหัสผ่าน.',
      });
      return;
    }if (!confirm_passwords) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        code: 400,
        payload: Reset,
        message: 'confirm password is null.',
        message_th: 'กรุณา กำหนดค่า ยืนยันรหัสผ่าน.',
      });
      return;
    }if (passwords_update!=confirm_passwords) {
      res.status(HttpStatus.NOT_FOUND).json({
        statusCode: HttpStatus.NOT_FOUND,
        code: 400,
        payload: Reset,
        message: 'Password and Confirm Password do not match..',
        message_th: 'รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน.',
      });
      return;
    }
    const password: any = passwordStrength(passwords).value;
    const confirm_password: any = passwordStrength(confirm_passwords).value;
    if (password != confirm_password) {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        payload: null,
        message: 'Passwords do not match.. ',
        message_th: 'รหัสผ่านไม่ตรงกัน..',
      });
      return;
    }

    if (password === 'Weak' || confirm_password === 'Weak') {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        payload: null,
        message: 'Password is ' + password + ' please change it for security.',
        message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
      });
      return;
    }
    if (password === 'Medium' || confirm_password === 'Medium') {
      res.status(200).json({
        statusCode: 200,
        code: 400,
        payload: null,
        message: 'Password is ' + password + ' please change it for security.',
        message_th: 'รหัสผ่านไม่รัดกุม กรุณาเปลี่ยนเพื่อความปลอดภัย.',
      });
      return;
    }

    const dto: any = {
      password: passwords_update,
      id: idx,
    };
    const rt: any = await this.usersService.resetPassword(dto);
    res.status(200).json({
      statusCode: 200,
      code: 200,
      payload: { data: rt, password: passwords_update },
      message: 'Reset password succeed.',
      message_th: 'รีเซ็ตรหัสผ่านสำเร็จ.',
    });
    return;
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'forgot-password' })
  @Post('forgot-password') //FogotPassword
  async ForgotPassword(
    @Res() res: Response,
    @Body(new ValidationPipe()) input: FogotPassword,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    console.log('input=>');
    console.info(input);
    let email: any = input.email;
    if (email === '' || email === null) {
      var result: any = {
        statuscode: 200,
        message: 'email is null',
        message_th: 'email is null',
        payload: null,
      };
      res.status(200).json(result);
      return;
    }
    const user: any = await this.usersService.getUserByEmail(input.email);
    if (user) {
      const status: any = user.status;
      if (status == 0 || status == false) {
        res.status(200).json({
          statuscode: 200,
          code: 200,
          payload: user.email,
          uid: user.id,
          message: 'Forbidden',
          message_th: 'Forbidden',
          error:
            'Forbidden! This username: ' +
            req.user.username +
            ' Email: ' +
            req.user.email +
            ' Inactive',
        });
        return;
      } else {
        var EXPIRE_TIME_SET = Number(900);
        const token: any = await this.authService.generateTokenUser(
          user.id,
          EXPIRE_TIME_SET,
        );
        var decoded: any = {};
        var decoded: any = this.jwtService.decode(token);
        var iat = decoded.iat * 1000;
        var exp = decoded.exp * 1000;
        var d1 = new Date(iat);
        var d2 = new Date(exp);
        var EXPIRE_TIME = Number(exp - iat);
        var TokenDate: any = {
          //iat: decoded.iat ,
          //exp: decoded.exp,
          // signin: iat,
          // expires: exp,
          // EXPIRE_TIME: EXPIRE_TIME,
          EXPIRE_TOKEN: EXPIRE_TIME_SET,
          signin_date: format.timeConvertermas(d1),
          expires_date: format.timeConvertermas(d2),
        };
        res.status(200).json({
          statuscode: 200,
          code: 200,
          token: token,
          payload: user.email,
          uid: user.id,
          did: decoded.id,
          TokenDate: TokenDate,
          message: 'Success',
          message_th:
            'Reset link are sended to your mailbox, check there first',
        });
        return;
      }
    } else {
      res.status(200).json({
        statuscode: 200,
        code: 404,
        payload: null,
        uid: null,
        message: 'Username not found in database',
        message_th: 'Username not found in database',
      });
      return;
    }
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @ApiOperation({ summary: 'refreshToken' })
  @Get('refreshToken')
  async GetrefreshToken(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ) {
    //console.log("req.headers.authorization=>")
    //console.info(req.headers.authorization)
    let jwt = req.headers.authorization.replace('Bearer ', '').trim();
    //console.log("jwt=>"+jwt)
    let jsonString: any = this.jwtService.decode(jwt) as { id: string };
    //console.info("jsonString=>"+jsonString)
    let idx = jsonString.id;
    await this.authService.checkRefreshToken(idx);
    //console.info("idx=>"+idx)
    //const Token:any= await this.authService.generateToken(idx);
    const TokenTime: any = await this.authService.generateTokenTime(idx);
    var decoded: any = {};
    var decoded: any = this.jwtService.decode(TokenTime);
    var decoded1: any = this.jwtService.decode(jwt);
    var iat = decoded.iat * 1000;
    var exp = decoded.exp * 1000;
    var d1 = new Date(iat);
    var d2 = new Date(exp);
    var EXPIRE_TIME = Number(exp - iat);
    var TokenDate: any = {
      //iat: decoded.iat ,
      //exp: decoded.exp,
      signin: iat,
      expires: exp,
      EXPIRE_TIME: EXPIRE_TIME,
      EXPIRE_TOKEN: process.env.EXPIRE_TOKEN,
      signin_date: format.timeConvertermas(d1),
      expires_date: format.timeConvertermas(d2),
    };
    const proFile = {
      uid: req.user.id,
      userCreatedatd: req.user.createddate,
      username: req.user.username,
      email: req.user.email,
      status: req.user.status,
      usertype: req.user.usertype,
      type: req.user.type,
    };
    const status: any = req.user.status;
    if (status == 0 || status == false) {
      var result: any = {
        statuscode: 200,
        message:
          'Forbidden! This username: ' +
          req.user.username +
          ' Email: ' +
          req.user.email +
          ' Inactive',
        payload: null,
      };
      return result;
    } else {
      const Response: any = {
        statuscode: 200,
        payload: proFile,
        id: idx,
        token: TokenTime,
        //tokenOld: jwt,
        TokenDate: TokenDate,
        message: 'decode token',
      };
      return await Response;
    }
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @ApiOperation({ summary: 'logout' })
  @Get('logout')
  async logOut(
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
    @Req() req: any,
  ): Promise<User> {
    const token =
      req.headers.authorization.replace('Bearer ', '').trim() ||
      req.headers.authorization.replace('Bearer ', '') ||
      '';
    console.log('token=>');
    console.info(token);
    if (!token) {
      var result: any = {
        statuscode: 200,
        code: 422,
        case: 1,
        message: 'Token information not found.',
        message_th: 'ไม่พบข้อมูล Token ที่ระบุ..',
        payload: token,
      };
      res.status(200).json(result);
      return;
    }
    let jsonString: any = this.jwtService.decode(token) as { id: string };
    //console.info("jsonString=>"+jsonString);
    let idx = jsonString.id;
    console.log('idx');
    console.info(idx);
    const Profiles: any = await this.usersService.getProfile(idx);
    const Profile: any = Profiles[0];
    var uid: any = Profile.uid;
    var status: any = Profile.status;
    const refresh_token: any = Profile.refresh_token;
    console.log('Get uid');
    console.info(uid);
    console.log('Get refresh_tokens');
    console.info(refresh_token);
    if (!refresh_token) {
      var result: any = {
        statuscode: 200,
        code: 422,
        case: 2,
        message: 'Refresh Token information not found.',
        message_th: 'ไม่พบข้อมูล Refresh Token ที่ระบุ..',
        payload: uid,
      };
      res.status(200).json(result);
      return;
    }
    if (status == 0 || status == false || status == '') {
      var result: any = {
        statuscode: 200,
        case: 3,
        message: 'Forbidden!',
        payload: status,
      };
      res.status(200).json(result);
      return;
    }
    if (!refresh_token) {
      var result: any = {
        statuscode: 200,
        code: 422,
        case: 4,
        message: 'Refresh Token information not found.',
        message_th: 'ไม่พบข้อมูล Refresh Token ที่ระบุ..',
        payload: refresh_token,
      };
      res.status(200).json(result);
      return;
    }
    // const oldToken : any=req.user.refresh_token;
    const oldTokenNue = null;
    await this.usersService.logout(idx, oldTokenNue);
    const resultRT: any = {
      statuscode: 200,
      code: 200,
      case: 5,
      message: 'Logout successfull.',
      message_th: 'ออกจากระบบสำเร็จ.',
      payload: idx,
    };
    res.status(200).json(resultRT);
    return;
  }

  @HttpCode(HttpStatus.OK)
  @AuthUserRequired()
  @UseGuards(AuthGuardUser)
  @Delete(':id')
  async remove(
    @Req() req,
    @Param('id') id: string,
    @Res() res: Response,
    @Body() dto: any,
    @Query() query: any,
    @Headers() headers: any,
    @Param() params: any,
  ) {
    let jwt: any = req.headers.authorization.replace('Bearer ', '');
    const token: any = req.headers.authorization.replace('Bearer ', '').trim();
    //console.log("token=>"+token)
    let jsonString: any = this.jwtService.decode(token) as { id: string };
    //console.info("jsonString=>"+jsonString)
    let idx = jsonString.id;
    await this.authService.checkRefreshToken(idx);
    if (idx == id) {
      // Update data delete
      const result: any = {
        statuscode: 200,
        message: 'Delete data successfull...',
        message_th: 'ลบข้อมูล จากระบบ...',
        payload: id,
      };
      res.status(200).json(result);
      return;
    }
    const resultRT: any = await this.usersService.remove(id);
    const result: any = {
      statuscode: 200,
      message: 'Delete successfull.',
      message_th: 'ลบข้อมูล จากระบบสำเร็จ.',
      payload: id,
    };
    res.status(200).json(result);
    return;
  }
}
