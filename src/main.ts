import helmet from 'helmet';
import { json } from 'express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from '@src/app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { errorHandler } from '@src/middleware/error-handler';
import 'dotenv/config';

// หมายเหตุ: ใช้ค่าจาก process.env เป็นหลักตามโครงสร้างเดิมของคุณ
var API_VERSION = '1';
var IP = `172.25.99.10`;
var NETMASK = `255.255.255.0`;
var GETWAY = `172.25.99.1`;
var MQTT_HOST_IP = `${process.env.MQTT_HOST_IP}` || 'localhost';
var MQTT_PORT = `${process.env.MQTT_PORT}` || '1883';
var MQTT_HOST = process.env.MQTT_HOST || 'mqtt://172.25.99.10:1883';
const MQTT_CLIENT_ID =
  `${process.env.MQTT_CLIENT_ID}` ||
  `nest_client_${Math.random().toString(16).slice(2, 8)}`;
var MQTT_TOPIC = 'BAACTW02/DATA';
var MQTT_ADDR = MQTT_HOST;

async function bootstrap() {
  // 1. สร้าง Main Application (HTTP + Socket.io)
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // 2. เชื่อมต่อ MQTT แบบ Microservice (Hybrid App)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: MQTT_HOST,
      clientId: MQTT_CLIENT_ID,
      clean: true,
    },
  });

  // 3. API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: API_VERSION,
  });

  // 4. CORS Setup
  const corsOptions =
    !process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS === '*'
      ? '*'
      : process.env.ALLOWED_ORIGINS.split(',');

  app.enableCors({
    origin: corsOptions,
    credentials: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
  });

  // 5. Global Pipes & Middleware
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.use(json({ limit: '50mb' })); // ปรับจาก Infinity เป็น 50mb เพื่อความปลอดภัย
  app.use(errorHandler);
  app.use(helmet());

  // 6. Swagger Configuration
  const host = process.env.HOST || 'http://localhost';
  const port = configService.get<number>('app.port') || 3003;

  const config = new DocumentBuilder()
    .setTitle('CmonIoT Auth Api Swagger Service')
    .setDescription('CmonIoT API with MQTT & Socket.io Integration')
    .setVersion('1.0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'default',
    )
    .addTag('auth', 'signinuser')
    .addTag('users', 'me')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'Token' },
      'access-token',
    )
    .addServer(`${host}:${port}`, 'Current Server')
    .addServer(`http://localhost:${port}`, 'Localhost')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/document', app, document, {
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'CmonIoT Swagger Documentation',
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
    customCssUrl: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css',
    ],
  });

  // 7. สั่งรัน Microservices และ HTTP Server
  await app.startAllMicroservices();

  await app.listen(port, () => {
    console.log(
      ' ✅ IP=>' + IP + ' 🟡 NETMASK=>' + NETMASK + ' 🔴 GETWAY=>' + GETWAY,
    );
    console.log(
      ' ✅ MQTT_HOST_IP=>' +
        MQTT_HOST_IP +
        ' 🔌 MQTT_PORT=>' +
        MQTT_PORT +
        ' 🟢 MQTT_HOST=>' +
        MQTT_HOST,
    );
    console.log(' ✅ MQTT_ADDR=>' + MQTT_ADDR);
    console.log(` 🟢 CmonIoT Nest ✅ app is listening on 🚀 port ${port}`);
    console.log(` 📡 Socket.io is running on the same port`);
  });
}

bootstrap();
