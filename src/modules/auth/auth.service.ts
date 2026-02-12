import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';
import { User } from '@src/modules/users/entities/user.entity';
import * as format from '@src/helpers/format.helper';
import * as argon2 from 'argon2';
import { compare } from 'bcrypt';
import { AuthJwtPayload } from '@src/modules/auth/types/auth-jwtPayload';
import refreshJwtConfig from '@src/modules/auth/config/refresh-jwt.config';
import { ConfigType } from '@nestjs/config';
import 'dotenv/config';
require('dotenv').config();
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async generateTokenApikey(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async generateToken(ids: any): Promise<string> {
    //console.log('generateToken ids =>')
    //console.info(ids)
    const tokenGen: any = await this.jwtService.sign({ id: ids });
    //console.log('tokenGen =>')
    //console.info(tokenGen)
    return tokenGen;
  }

  async generateTokenDecode(ids: any): Promise<string> {
    //console.log('generateToken ids =>')
    //console.info(ids)
    const tokenGen: any = await this.jwtService.sign({ id: ids });
    //console.log('tokenGen =>')
    //console.info(tokenGen)
    return tokenGen;
  }

  async generateTokenTime(id: string): Promise<string> {
    try {
      //const token = await this.jwtService.sign({ id: id });
       const token = await this.jwtService.sign(
        { 
          id: id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
      return token;
    } catch (error) {
      throw new BadRequestException('Token generation failed');
    }
  }

  async generateTokenUser(ids: any, expires: any): Promise<string> {
    //console.log('generateToken ids =>')
    //console.info(ids)
    let expire_time: any = expires;
    if (expire_time == '') {
     // const tokenRs = await this.jwtService.sign({ id: ids });
      const tokenRs = await this.jwtService.sign(
        { 
          id: ids,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
      return tokenRs;
    } else {
      const tokenRs = await this.jwtService.signAsync(
        { id: ids },
        {
          expiresIn: expire_time || process.env.EXPIRE_TOKEN || '1d',
          secret: process.env.SECRET_KEY,
        },
      );
      return tokenRs;
    }
  }

  async validateUser(payload: any): Promise<User | undefined> {
    // Implement your user validation logic here, e.g., fetch user from database
    const loggedInUser = await this.userService.getUser(payload.id);
    return loggedInUser;
  }

  async authenticateSetGen(auth): Promise<any> {
    const user = await this.userService.getUserByEmail(auth.email);

    if (!user) {
      throw new BadRequestException();
    }

    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    if (!isRightPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    //console.log('user =>')
    //console.info(user)
    //const createddateRT:any=format.timeConvertermas(user.createddate)
    //console.log('createddate =>'+createddateRT)
    const status: any = user.status;
    if (status == 0 || status == '' || status == false) {
      var result: any = {
        //status: 200,
        code: 422,
        message:
          'Forbidden! This username: ' +
          user.username +
          ' Email: ' +
          user.email +
          ' Inactive',
        payload: { proFile: null },
      };
      return result;
    } else {
      //const token= await this.jwtService.sign({ id: user.id });
      const tokenRs = await this.jwtService.sign({ id: user.id  });

      // console.log('hashedrefreshtoken =>')
      // console.info(hashedrefreshtoken)
      // console.log('updaterefreshtoken =>')
      // console.info(updaterefreshtoken)

      let jsonString: any = this.jwtService.decode(tokenRs) as { id: string };
      //console.info("jsonString=>"+jsonString)
      let idx = jsonString.id;
      var decoded: any = {};
      var decoded: any = this.jwtService.decode(tokenRs);
      var iat = decoded.iat * 1000;
      var exp = decoded.exp * 1000;
      var d1 = new Date(iat);
      var d2 = new Date(exp);
      var EXPIRE_TIME = Number(exp - iat);
      //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
      const hashedrefreshtoken = await this.generateAccessToken(user.id);
      const updaterefreshtoken = await this.userService.updaterefreshtoken(
        idx,
        hashedrefreshtoken,
      );

      return {
        uid: user.id,
        //email: user.email,
        uname: user.username,
        pass: user.password_temp,
        //active_status:active_status,
        //type: user.type,
        //usertype: user.usertype,
        //created: createddateRT,
        token: tokenRs,
        iat: iat,
        exp: exp,
        EXPIRE_TOKEN_APP: process.env.EXPIRE_TOKEN_APP,
        signin_date: format.timeConvertermas(d1),
        expires_date: format.timeConvertermas(d2),
        //refreshToken:hashedrefreshtoken,
      };
    }
  }

  async authenticateSet(auth): Promise<any> {
    const user = await this.userService.getUserByEmail(auth.email);
    if (!user) {
      throw new BadRequestException();
    }
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    if (!isRightPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    //console.log('user =>')
    //console.info(user)
    //const createddateRT:any=format.timeConvertermas(user.createddate)
    //console.log('createddate =>'+createddateRT)
    const status: any = user.status;
    if (status == 0 || status == '' || status == false) {
      var result: any = {
        //status: 200,
        code: 422,
        message:
          'Forbidden! This username: ' +
          user.username +
          ' Email: ' +
          user.email +
          ' Inactive',
        payload: { proFile: null },
      };
      return result;
    } else {
      //const token= await this.jwtService.sign({ id: user.id });
      const tokenRs = await this.jwtService.sign({ id: user.id  });

      // console.log('hashedrefreshtoken =>')
      // console.info(hashedrefreshtoken)
      // console.log('updaterefreshtoken =>')
      // console.info(updaterefreshtoken)

      let jsonString: any = this.jwtService.decode(tokenRs) as { id: string };
      //console.info("jsonString=>"+jsonString)
      let idx = jsonString.id;
      var decoded: any = {};
      var decoded: any = this.jwtService.decode(tokenRs);
      var iat = decoded.iat * 1000;
      var exp = decoded.exp * 1000;
      var d1 = new Date(iat);
      var d2 = new Date(exp);
      var EXPIRE_TIME = Number(exp - iat);
      //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
      const hashedrefreshtoken = await this.generateAccessToken(user.id);
      const updaterefreshtoken = await this.userService.updaterefreshtoken(
        idx,
        hashedrefreshtoken,
      );

      return {
        uid: user.id,
        //email: user.email,
        uname: user.username,
        //active_status:active_status,
        //type: user.type,
        //usertype: user.usertype,
        //created: createddateRT,
        token: tokenRs,
        iat: iat,
        exp: exp,
        EXPIRE_TOKEN_APP: process.env.EXPIRE_TOKEN_APP,
        signin_date: format.timeConvertermas(d1),
        expires_date: format.timeConvertermas(d2),
        //refreshToken:hashedrefreshtoken,
      };
    }
  }

  async authenticate(auth): Promise<any> {
    console.log('authenticate auth =>');
    console.info(auth);
    // console.log('auth.email =>'+auth.email)
    // console.log('auth UserAuthModel =>')
    // console.info(auth.UserAuthModel)
    const user: any = await this.userService.getUserByEmail(auth.email);
    // console.log('user =>')
    // console.info(user)
    // return user;
    if (!user) {
      //throw new BadRequestException();
      const result: any = {
        //status: 200,
        code: 422,
        message: 'This email or user not found data or Inactive',
        message_th:
          'ไม่พบข้อมูลในอีเมลหรือบัญชีผู้ใช้งานนี้ หรือ สถานะไม่ได้เปิดใช้งาน',
        payload: { proFile: null },
      };
      return result;
      //throw new BadRequestException();
    }
    // console.log('user =>')
    // console.info(user)
    // return user;
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    console.log('authenticate isRightPassword =>');
    console.info(isRightPassword);
    // console.log('authenticate user =>');console.info(user);
    // console.log('isRightPassword =>');console.info(isRightPassword);
    if (isRightPassword == false || isRightPassword == 0) {
      var userChk = await this.userService.finduserId(user.id);
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          //status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          username: userChk.username,
          token: null,
          message:
            'This user account is locked. Please contact the administrator.',
          message_th:
            'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }
      var user2 = await this.userService.finduserId(user.id);
      var loginfailed1: number = user2.loginfailed;
      var loginfailed: number = loginfailed1 + 1;
      await this.userService.updatereloginfailed(user.id, loginfailed);
      const result: any = {
        // status: 200,
        code: 200,
        message: 'Password is incorrect.',
        message_th: 'รหัสผ่านไม่ถูกต้อง',
        payload: { proFile: null },
      };
      return result;
      //throw new BadRequestException('Invalid credentials');
    } else {
      var loginfailed: number = 0;
      // await this.userService.updatereloginfailed(user.id,loginfailed);
    }
    var userChk = await this.userService.finduserId(user.id);
    var loginfailed1: number = userChk.loginfailed;
    if (loginfailed1 >= 10) {
      const data: any = {
        // status: 200,
        code: 422,
        uid: userChk.id,
        email: userChk.email,
        username: userChk.username,
        token: null,
        message:
          'This user account is locked. Please contact the administrator.',
        message_th:
          'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
        loginfailed: loginfailed1,
        //refreshToken :hashedrefreshtoken,
      };
      return await data;
    }
    console.log('isRightPassword =>');
    console.info(isRightPassword);
    if (isRightPassword != false || isRightPassword != 0) {
      var loginfailed: number = 0;
      await this.userService.updatereloginfailed(user.id, loginfailed);
    }

    // console.log('user =>');console.info(user);

    const createddateRT: any = format.timeConvertermas(user.createddate);
    //console.log('createddate =>'+createddateRT)
    const status: any = user.status;
    if (status == '' || status == 0 || status == false) {
      const result: any = {
        // status: 200,
        code: 200,
        message: 'This email or username not found data or Inactive',
        message_th: 'ไม่พบข้อมูลในอีเมลนี้หรือไม่ได้ใช้งาน',
        payload: { proFile: null },
      };
      return result;
    } else {
      var userChk = await this.userService.finduserId(user.id);
      //console.log('userChk=>'); console.info(userChk);  return
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          // status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          //username: userChk.username,
          token: null,
          msg: 'login failed',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }

      //const token= await this.jwtService.sign({ id: user.id });
      const tokenRs = await this.jwtService.sign({ id: user.id  });
      //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
      const hashedrefreshtoken = await this.generateAccessToken(user.id);
      const updaterefreshtoken = await this.userService.updaterefreshtoken(
        user.id,
        hashedrefreshtoken,
      );
      return {
        // status: 200,
        code: 200,
        uid: user.id,
        email: user.email,
        username: user.username,
        token: tokenRs,
        // refreshToken: hashedrefreshtoken,
      };
    }
  }

  async authenticateEmail(auth): Promise<any> {
    console.log('authenticate auth =>');
    console.info(auth);
    // console.log('auth.email =>'+auth.email)
    // console.log('auth UserAuthModel =>')
    // console.info(auth.UserAuthModel)
    const user: any = await this.userService.getUserByEmail(auth.email);
    // console.log('user =>')
    // console.info(user)
    // return user;
    if (!user) {
      //throw new BadRequestException();
      const result: any = {
        //status: 200,
        code: 422,
        message: 'This email or user not found data or Inactive',
        message_th:
          'ไม่พบข้อมูลในอีเมลหรือบัญชีผู้ใช้งานนี้ หรือ สถานะไม่ได้เปิดใช้งาน',
        payload: { proFile: null },
      };
      return result;
      //throw new BadRequestException();
    }
    // console.log('user =>')
    // console.info(user)
    // return user;
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    console.log('authenticate isRightPassword =>');
    console.info(isRightPassword);
    // console.log('authenticate user =>');console.info(user);
    // console.log('isRightPassword =>');console.info(isRightPassword);
    if (isRightPassword == false || isRightPassword == 0) {
      var userChk = await this.userService.finduserId(user.id);
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          //status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          username: userChk.username,
          token: null,
          message:
            'This user account is locked. Please contact the administrator.',
          message_th:
            'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }
      var user2 = await this.userService.finduserId(user.id);
      var loginfailed1: number = user2.loginfailed;
      var loginfailed: number = loginfailed1 + 1;
      await this.userService.updatereloginfailed(user.id, loginfailed);
      const result: any = {
        // status: 200,
        code: 200,
        message: 'Password is incorrect.',
        message_th: 'รหัสผ่านไม่ถูกต้อง',
        payload: { proFile: null },
      };
      return result;
      //throw new BadRequestException('Invalid credentials');
    } else {
      var loginfailed: number = 0;
      // await this.userService.updatereloginfailed(user.id,loginfailed);
    }
    var userChk = await this.userService.finduserId(user.id);
    var loginfailed1: number = userChk.loginfailed;
    if (loginfailed1 >= 10) {
      const data: any = {
        // status: 200,
        code: 422,
        uid: userChk.id,
        email: userChk.email,
        username: userChk.username,
        token: null,
        message:
          'This user account is locked. Please contact the administrator.',
        message_th:
          'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
        loginfailed: loginfailed1,
        //refreshToken :hashedrefreshtoken,
      };
      return await data;
    }
    console.log('isRightPassword =>');
    console.info(isRightPassword);
    if (isRightPassword != false || isRightPassword != 0) {
      var loginfailed: number = 0;
      await this.userService.updatereloginfailed(user.id, loginfailed);
    }

    // console.log('user =>');console.info(user);

    const createddateRT: any = format.timeConvertermas(user.createddate);
    //console.log('createddate =>'+createddateRT)
    const status: any = user.status;
    if (status == '' || status == 0 || status == false) {
      const result: any = {
        // status: 200,
        code: 200,
        message: 'This email or username not found data or Inactive',
        message_th: 'ไม่พบข้อมูลในอีเมลนี้หรือไม่ได้ใช้งาน',
        payload: { proFile: null },
      };
      return result;
    } else {
      var userChk = await this.userService.finduserId(user.id);
      //console.log('userChk=>'); console.info(userChk);  return
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          // status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          //username: userChk.username,
          token: null,
          msg: 'login failed',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }

      //const token= await this.jwtService.sign({ id: user.id });
      await this.jwtService.sign({ id: user.id  });
      // const tokenRs = await this.jwtService.signAsync(
      //   { id: user.id },
      //   {
      //     expiresIn: process.env.EXPIRE_TOKEN || '30d',
      //     secret: process.env.SECRET_KEY,
      //   },
      // );
       const tokenRs = await this.jwtService.sign(
        { 
          id: user.id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        },
      );

      //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
      const hashedrefreshtoken = await this.generateAccessToken(user.id);
      const updaterefreshtoken = await this.userService.updaterefreshtoken(
        user.id,
        hashedrefreshtoken,
      );
      return {
        // status: 200,
        code: 200,
        uid: user.id,
        email: user.email,
        username: user.username,
        token: tokenRs,
        // refreshToken: hashedrefreshtoken,
      };
    }
  }

  async authenticateuser(auth): Promise<any> {
    console.log('authenticate auth =>');
    console.info(auth);
    console.log('auth.email =>' + auth.username);
    // console.log('auth UserAuthModel =>')
    // console.info(auth.UserAuthModel)
    const user: any = await this.userService.getUserByusernameauth(
      auth.username,
    );
    console.log('user =>');
    console.info(user);
    // return user;
    if (!user) {
      //throw new BadRequestException();
      const result: any = {
        //status: 200,
        code: 422,
        message: 'This username  not found data or Inactive',
        message_th:
          'ไม่พบข้อมูลใน บัญชีผู้ใช้งานนี้ หรือ สถานะไม่ได้เปิดใช้งาน',
        payload: { proFile: null },
      };
      return result;
    }
    // console.log('user =>')
    // console.info(user)
    // return user;
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    console.log('authenticate isRightPassword =>');
    console.info(isRightPassword);
    // console.log('authenticate user =>');console.info(user);
    // console.log('isRightPassword =>');console.info(isRightPassword);
    if (isRightPassword == false || isRightPassword == 0) {
      var userChk = await this.userService.finduserId(user.id);
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          //status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          username: userChk.username,
          token: null,
          message:
            'This user account is locked. Please contact the administrator.',
          message_th:
            'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }
      var user2 = await this.userService.finduserId(user.id);
      var loginfailed1: number = user2.loginfailed;
      var loginfailed: number = loginfailed1 + 1;
      await this.userService.updatereloginfailed(user.id, loginfailed);
      const result: any = {
        // status: 200,
        code: 200,
        message: 'Password is incorrect.',
        message_th: 'รหัสผ่านไม่ถูกต้อง',
        payload: { proFile: null },
      };
      return result;
      //throw new BadRequestException('Invalid credentials');
    } else {
      var loginfailed: number = 0;
      // await this.userService.updatereloginfailed(user.id,loginfailed);
    }
    var userChk = await this.userService.finduserId(user.id);
    var loginfailed1: number = userChk.loginfailed;
    if (loginfailed1 >= 10) {
      const data: any = {
        // status: 200,
        code: 422,
        uid: userChk.id,
        email: userChk.email,
        username: userChk.username,
        token: null,
        message:
          'This user account is locked. Please contact the administrator.',
        message_th:
          'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
        loginfailed: loginfailed1,
        //refreshToken :hashedrefreshtoken,
      };
      return await data;
    }
    console.log('isRightPassword =>');
    console.info(isRightPassword);
    if (isRightPassword != false || isRightPassword != 0) {
      var loginfailed: number = 0;
      await this.userService.updatereloginfailed(user.id, loginfailed);
    }

    // console.log('user =>');console.info(user);

    const createddateRT: any = format.timeConvertermas(user.createddate);
    //console.log('createddate =>'+createddateRT)
    const status: any = user.status;
    if (status == '' || status == 0 || status == false) {
      const result: any = {
        // status: 200,
        code: 200,
        message: 'This email or username not found data or Inactive',
        message_th: 'ไม่พบข้อมูลในอีเมลนี้หรือไม่ได้ใช้งาน',
        payload: { proFile: null },
      };
      return result;
    } else {
      var userChk = await this.userService.finduserId(user.id);
      //console.log('userChk=>'); console.info(userChk);  return
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          // status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          //username: userChk.username,
          token: null,
          msg: 'login failed',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }

      //const token= await this.jwtService.sign({ id: user.id }); 
      const tokenRs = await this.jwtService.sign(
        { 
          id: user.id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
      //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
      const hashedrefreshtoken = await this.generateAccessToken(user.id);
      const updaterefreshtoken = await this.userService.updaterefreshtoken(
        user.id,
        hashedrefreshtoken,
      );
      return {
        // status: 200,
        code: 200,
        uid: user.id,
        email: user.email,
        username: user.username,
        token: tokenRs,
        // refreshToken: hashedrefreshtoken,
      };
    }
  }

  async authenticateemail(auth): Promise<any> {
    console.log('authenticate auth =>');
    console.info(auth);
    // console.log('auth.email =>'+auth.email)
    // console.log('auth UserAuthModel =>')
    // console.info(auth.UserAuthModel)
    const user: any = await this.userService.getUserByEmail(auth.email);
    // console.log('user =>')
    // console.info(user)
    // return user;
    if (!user) {
      //throw new BadRequestException();
      const result: any = {
        //status: 200,
        code: 422,
        message: 'This email not found data or Inactive',
        message_th: 'ไม่พบข้อมูลในอีเมลนี้ หรือ สถานะไม่ได้เปิดใช้งาน',
        payload: { proFile: null },
      };
      return result;
    }
    // console.log('user =>')
    // console.info(user)
    // return user;
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    console.log('authenticate isRightPassword =>');
    console.info(isRightPassword);
    // console.log('authenticate user =>');console.info(user);
    // console.log('isRightPassword =>');console.info(isRightPassword);
    if (isRightPassword == false || isRightPassword == 0) {
      var userChk = await this.userService.finduserId(user.id);
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          //status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          username: userChk.username,
          token: null,
          message:
            'This user account is locked. Please contact the administrator.',
          message_th:
            'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }
      var user2 = await this.userService.finduserId(user.id);
      var loginfailed1: number = user2.loginfailed;
      var loginfailed: number = loginfailed1 + 1;
      await this.userService.updatereloginfailed(user.id, loginfailed);
      const result: any = {
        // status: 200,
        code: 200,
        message: 'Password is incorrect.',
        message_th: 'รหัสผ่านไม่ถูกต้อง',
        payload: { proFile: null },
      };
      return result;
      //throw new BadRequestException('Invalid credentials');
    } else {
      var loginfailed: number = 0;
      // await this.userService.updatereloginfailed(user.id,loginfailed);
    }
    var userChk = await this.userService.finduserId(user.id);
    var loginfailed1: number = userChk.loginfailed;
    if (loginfailed1 >= 10) {
      const data: any = {
        // status: 200,
        code: 422,
        uid: userChk.id,
        email: userChk.email,
        username: userChk.username,
        token: null,
        message:
          'This user account is locked. Please contact the administrator.',
        message_th:
          'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
        loginfailed: loginfailed1,
        //refreshToken :hashedrefreshtoken,
      };
      return await data;
    }
    console.log('isRightPassword =>');
    console.info(isRightPassword);
    if (isRightPassword != false || isRightPassword != 0) {
      var loginfailed: number = 0;
      await this.userService.updatereloginfailed(user.id, loginfailed);
    }

    // console.log('user =>');console.info(user);

    const createddateRT: any = format.timeConvertermas(user.createddate);
    //console.log('createddate =>'+createddateRT)
    const status: any = user.status;
    if (status == '' || status == 0 || status == false) {
      const result: any = {
        // status: 200,
        code: 200,
        message: 'This email or username not found data or Inactive',
        message_th: 'ไม่พบข้อมูลในอีเมลนี้หรือไม่ได้ใช้งาน',
        payload: { proFile: null },
      };
      return result;
    } else {
      var userChk = await this.userService.finduserId(user.id);
      //console.log('userChk=>'); console.info(userChk);  return
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          // status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          //username: userChk.username,
          token: null,
          msg: 'login failed',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }

      //const token= await this.jwtService.sign({ id: user.id });
       const tokenRs = await this.jwtService.sign(
        { 
          id: user.id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
      //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
      const hashedrefreshtoken = await this.generateAccessToken(user.id);
      const updaterefreshtoken = await this.userService.updaterefreshtoken(
        user.id,
        hashedrefreshtoken,
      );
      return {
        // status: 200,
        code: 200,
        uid: user.id,
        email: user.email,
        username: user.username,
        token: tokenRs,
        // refreshToken: hashedrefreshtoken,
      };
    }
  }

  async authenticateUserAuthen(auth): Promise<any> {
    // console.log('authenticateUserEmail auth =>')
    // console.info(auth)
    var user = await this.userService.getUserByEmail(auth.email);
    if (!user) {
      var user = await this.userService.getUserByusername(auth.email);
      if (!user) {
        //throw new BadRequestException();
        const data: any = {
          // status: 200,
          code: 422,
          uid: null,
          email: null,
          token: null,
          msg: 'Invalid credentials',
          loginfailed: 0,
        };
        return await data;
      }
    } else if (!user) {
      //throw new BadRequestException();
      const data: any = {
        // status: 200,
        code: 422,
        uid: null,
        email: null,
        token: null,
        msg: 'Invalid credentials',
        loginfailed: 0,
      };
      return await data;
    }

    var userChk = await this.userService.finduserId(user.id);
    //console.log('userChk=>'); console.info(userChk);  return
    var loginfailed1: number = userChk.loginfailed;
    if (loginfailed1 >= 10) {
      const data: any = {
        //  status: 200,
        code: 422,
        uid: userChk.id,
        email: userChk.email,
        //username: userChk.username,
        token: null,
        msg: 'login failed',
        loginfailed: loginfailed1,
        //refreshToken :hashedrefreshtoken,
      };
      return await data;
    }
    // console.log('authenticateUserEmail user=>')
    // console.info(user)
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    if (!isRightPassword) {
      var userChk = await this.userService.finduserId(user.id);
      var loginfailed1: number = userChk.loginfailed;
      if (loginfailed1 >= 10) {
        const data: any = {
          //  status: 200,
          code: 422,
          uid: userChk.id,
          email: userChk.email,
          username: userChk.username,
          token: null,
          message:
            'This user account is locked. Please contact the administrator.',
          message_th:
            'บัญชีผู้ใช้งานนี้ถูกล็อค การใช้งาน กรุณาติดต่อผู้ดูแลระบบ.',
          loginfailed: loginfailed1,
          //refreshToken :hashedrefreshtoken,
        };
        return await data;
      }
      var user2 = await this.userService.finduserId(user.id);
      var loginfailed1: number = user2.loginfailed;
      var loginfailed: number = loginfailed1 + 1;
      await this.userService.updatereloginfailed(user.id, loginfailed);
      const result: any = {
        //  status: 200,
        code: 422,
        message: 'Password is incorrect.',
        message_th: 'รหัสผ่านไม่ถูกต้อง',
        payload: { proFile: null },
      };
      return result;
      //throw new BadRequestException('Invalid credentials');
    } else {
      var loginfailed: number = 0;
      // await this.userService.updatereloginfailed(user.id,loginfailed);
    }
    // console.log('authenticateUserEmail isRightPassword=>'+isRightPassword)
    // console.log('authenticateUserEmail user.id =>'+user.id)
    // console.info(user.id)
    //const token= await this.jwtService.sign({ id: user.id });

    var userChk = await this.userService.finduserId(user.id);
    //console.log('userChk=>'); console.info(userChk);  return
    var loginfailed1: number = userChk.loginfailed;
    if (loginfailed1 >= 10) {
      const data: any = {
        //  status: 200,
        code: 422,
        uid: userChk.id,
        email: userChk.email,
        username: userChk.username,
        token: null,
        message: 'Password is incorrect ' + loginfailed1,
        message_th: 'รหัสผ่านไม่ถูกต้อง ' + loginfailed1,
        loginfailed: loginfailed1,
        //refreshToken :hashedrefreshtoken,
      };
      return await data;
    }
    console.log('isRightPassword =>');
    console.info(isRightPassword);
    if (isRightPassword != false || isRightPassword != 0) {
      var loginfailed: number = 0;
      await this.userService.updatereloginfailed(user.id, loginfailed);
    }

    const tokenRs = await this.jwtService.sign(
        { 
          id: user.id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
    //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
    const userId: any = user.id;
    //console.log('userId=>'+userId)
    const gentoken = await this.generateAccessToken(userId);
    //console.log('gentoken=>'+gentoken)
    await this.userService.updaterefreshtoken(userId, gentoken);
    const data: any = {
      //    status: 200,
      code: 422,
      message: 'login failed',
      message_th: 'login failed',
      uid: user.id,
      email: user.email,
      username: user.username,
      roleId: user.role_id,
      authUser: user.username,
      token: tokenRs,
      loginfailed: loginfailed1,
      //refreshToken :hashedrefreshtoken,
    };
    //console.log('authenticateUserEmail data=>'); console.info(data);
    return await data;
  }

  //loginfailed
  async authenticateUserAuthen2(auth): Promise<any> {
    // console.log('authenticateUserEmail auth =>')
    // console.info(auth)
    var user = await this.userService.getUserByEmail(auth.email);
    if (!user) {
      var user = await this.userService.getUserByusername(auth.email);
      if (!user) {
        // throw new BadRequestException();
        const data: any = {
          //  status: 200,
          code: 200,
          message: 'ok',
          message_th: 'Success',
          uid: null,
          email: null,
          token: null,
          loginfailed: 0,
        };
        return await data;
      }
    } else if (!user) {
      //throw new BadRequestException();
      const data: any = {
        //  status: 200,
        code: 422,
        message: 'login failed',
        message_th: 'login failed',
        uid: null,
        email: null,
        token: null,
        loginfailed: 0,
      };
      return await data;
    }
    var userChk = await this.userService.finduserId(user.id);
    //console.log('userChk=>'); console.info(userChk);  return
    var loginfailed1: number = userChk.loginfailed;
    if (loginfailed1 >= 10) {
      const data: any = {
        //  status: 200,
        code: 422,
        message: 'login failed',
        message_th: 'login failed',
        uid: userChk.id,
        email: userChk.email,
        //username: userChk.username,
        token: null,
        loginfailed: loginfailed1,
        //refreshToken :hashedrefreshtoken,
      };
      return await data;
    }
    // console.log('authenticateUserEmail user=>')
    // console.info(user)
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    console.log('isRightPassword =>');
    console.info(isRightPassword);
    if (isRightPassword == false || isRightPassword == null) {
      var user = await this.userService.finduserId(user.id);
      var loginfailed1: number = user.loginfailed;
      var loginfailed: number = loginfailed1 + 1;
      await this.userService.updatereloginfailed(user.id, loginfailed);
      throw new BadRequestException('Invalid credentials');
    } else {
      var loginfailed: number = 0;
      // await this.userService.updatereloginfailed(user.id,loginfailed);
    }
    // console.log('authenticateUserEmail isRightPassword=>'+isRightPassword)
    // console.log('authenticateUserEmail user.id =>'+user.id)
    // console.info(user.id)
    //const token= await this.jwtService.sign({ id: user.id });
    var userChk = await this.userService.finduserId(user.id);
    //console.log('userChk=>'); console.info(userChk);  return
    var loginfailed1: number = userChk.loginfailed;
    if (loginfailed1 >= 10) {
      const data: any = {
        //  status: 200,
        code: 422,
        message: 'login failed',
        message_th: 'login failed',
        uid: userChk.id,
        email: userChk.email,
        username: userChk.username,
        token: null,
        loginfailed: loginfailed1,
        //refreshToken :hashedrefreshtoken,
      };
      return await data;
    }
    console.log('isRightPassword =>');
    console.info(isRightPassword);
    if (isRightPassword != false || isRightPassword != 0) {
      var loginfailed: number = 0;
      await this.userService.updatereloginfailed(user.id, loginfailed);
    }
    const tokenRs = await this.jwtService.sign(
        { 
          id: user.id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
    //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
    const userId: any = user.id;
    //console.log('userId=>'+userId)
    const gentoken = await this.generateAccessToken(userId);
    //console.log('gentoken=>'+gentoken)
    await this.userService.updaterefreshtoken(userId, gentoken);
    const data: any = {
      //      status: 200,
      code: 200,
      message: 'ok',
      message_th: 'Success',
      uid: user.id,
      email: user.email,
      username: user.username,
      roleid: user.role_id,
      authUser: user.username,
      token: tokenRs,
      loginfailed: loginfailed1,
      //refreshToken :hashedrefreshtoken,
    };
    //console.log('authenticateUserEmail data=>'); console.info(data);
    return await data;
  }

  async userUnlock(auth): Promise<any> {
    // console.log('authenticateUserEmail auth =>')
    // console.info(auth)
    var user = await this.userService.getUserByEmail(auth.email);
    if (!user) {
      var user = await this.userService.getUserByusername(auth.email);
      if (!user) {
        throw new BadRequestException();
      }
    } else if (!user) {
      throw new BadRequestException();
    }
    var loginfailed: number = 0;
    await this.userService.updatereloginfailed(user.id, loginfailed);
    const data: any = {
      //    status: 200,
      code: 422,
      message: 'login failed',
      message_th: 'login failed',
      uid: user.id,
      email: user.email,
      username: user.username,
      token: null,
      loginfailed: loginfailed,
      //loginfailed:user.loginfailed,
    };
    return await data;
  }

  async authenticateUserEmail(auth): Promise<any> {
    // console.log('authenticateUserEmail auth =>')
    // console.info(auth)
    const user = await this.userService.getUserByEmail(auth.email);
    if (!user) {
      throw new BadRequestException();
    }
    // console.log('authenticateUserEmail user=>')
    // console.info(user)
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    if (!isRightPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    // console.log('authenticateUserEmail isRightPassword=>'+isRightPassword)
    // console.log('authenticateUserEmail user.id =>'+user.id)
    // console.info(user.id)
    //const token= await this.jwtService.sign({ id: user.id });
    const tokenRs = await this.jwtService.sign(
        { 
          id: user.id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
    //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
    const userId: any = user.id;
    //console.log('userId=>'+userId)
    const gentoken = await this.generateAccessToken(userId);
    //console.log('gentoken=>'+gentoken)
    await this.userService.updaterefreshtoken(userId, gentoken);
    const data: any = {
      //    status: 200,
      code: 200,
      message: 'ok',
      message_th: 'Success',
      uid: user.id,
      email: user.email,
      username: user.username,
      token: tokenRs,
      //refreshToken :hashedrefreshtoken,
    };
    //console.log('authenticateUserEmail data=>'); console.info(data);
    return await data;
  }

  async authenticateUser(auth): Promise<any> {
    const user = await this.userService.getUserByusername(auth.username);
    if (!user) {
      throw new BadRequestException();
    }
    const isRightPassword: any = await this.userService.compareHash(
      auth.password,
      user.password,
    );
    console.log('isRightPassword =>');
    console.info(isRightPassword);
    if (isRightPassword == false || isRightPassword == 0) {
      throw new BadRequestException('Invalid credentials');
    }
    //const token= await this.jwtService.sign({ id: user.id });
    const tokenRs = await this.jwtService.sign(
        { 
          id: user.id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
    //const hashedrefreshtoken2 = await argon2.hash(tokenRs);
    const refreshtoken = await this.generateAccessToken(user.id);
    console.log('refreshtoken =>' + refreshtoken);
    this.userService.updaterefreshtoken(user.id, refreshtoken);
    const rt: any = await {
      //  status: 200,
      code: 200,
      message: 'ok',
      message_th: 'Success',
      uid: user.id,
      email: user.email,
      username: user.username,
      token: tokenRs,
      //refreshToken :hashedrefreshtoken,
    };
    return rt;
  }

  async authenticateToken(auth): Promise<any> {
    return { token: this.jwtService.sign({ id: auth }) };
  }

  async checkRefreshToken(id: string) {
    const user = await this.userService.finduserId(id);
    if (!user || !user.refresh_token) {
      throw new BadRequestException('Invalid Token');
    }
  }

  async checkRefreshTokenInt(id: string) {
    const user = await this.userService.finduserId(id);
    if (!user || !user.refresh_token) {
      return await 0;
    } else {
      return await 1;
    }
  }

  async validateRefreshToken(id: string, refreshtoken: string) {
    const user = await this.userService.finduserId(id);
    if (!user || !user.refresh_token)
      throw new BadRequestException('Invalid Refresh Token');
    // console.log("id=>"+id)
    // console.log("refreshtoken=>"+refreshtoken)
    // console.log("user=>")
    // console.info(user)
    // console.log("refresh_token=>"+user.refresh_token)
    const refreshTokenMatches = await argon2.verify(
      user.refresh_token,
      refreshtoken,
    );
    if (!refreshTokenMatches)
      throw new BadRequestException('Invalid Refresh Token');

    return { id: id };
  }

  async validateGoogleUser(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }

  public async generateAccessToken(id): Promise<string> {
    const token = await this.jwtService.signAsync({ id: id });
    return token;
  }

  public async generateRefreshToken(
    id: string,
    expiresIn: number,
  ): Promise<string> {
    const token = await this.jwtService.sign(
        { 
          id: id,
          expiresIn: process.env.EXPIRE_TOKEN || '30d',
          secret: process.env.SECRET_KEY,
        });
    return token;
  }
  /********************/
}
