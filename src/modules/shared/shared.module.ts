import { Module } from '@nestjs/common';
import { SharedService } from '@src/modules/shared/shared.service';
import { SharedController } from '@src/modules/shared/shared.controller';
import 'dotenv/config';
require('dotenv').config();
console.log(
  '--------------------------:SharedModule:--------------------------',
);
@Module({
  providers: [SharedService],
  exports: [SharedService],
  controllers: [SharedController],
})
export class SharedModule {}

// https://medium.com/@sangimed/complete-guide-to-sending-emails-through-an-smtp-server-with-nestjs-d75972dee394
/*
require('dotenv').config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailerModule } from '@nestjs-modules/mailer/';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.office365.com',
        port: 587,
        tls: {
          ciphers: 'SSLv3',
        },
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USEWRNAME, // generated ethereal user
          pass: process.env.SMTP_PASSWOED, // generated ethereal password
        },
      },
      defaults: {
        from: '"cmoniot" <process.env.EMAIL_FROM>', // outgoing email ID
      },
      template: {
        dir: process.cwd() + '/template/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
*/
