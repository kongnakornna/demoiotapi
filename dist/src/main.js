"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const express_1 = require("express");
const core_1 = require("@nestjs/core");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const microservices_1 = require("@nestjs/microservices");
const error_handler_1 = require("./middleware/error-handler");
require("dotenv/config");
var API_VERSION = '1';
var IP = `172.25.99.10`;
var NETMASK = `255.255.255.0`;
var GETWAY = `172.25.99.1`;
var MQTT_HOST_IP = `${process.env.MQTT_HOST_IP}` || 'localhost';
var MQTT_PORT = `${process.env.MQTT_PORT}` || '1883';
var MQTT_HOST = process.env.MQTT_HOST || 'mqtt://172.25.99.10:1883';
const MQTT_CLIENT_ID = `${process.env.MQTT_CLIENT_ID}` ||
    `nest_client_${Math.random().toString(16).slice(2, 8)}`;
var MQTT_TOPIC = 'BAACTW02/DATA';
var MQTT_ADDR = MQTT_HOST;
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.connectMicroservice({
        transport: microservices_1.Transport.MQTT,
        options: {
            url: MQTT_HOST,
            clientId: MQTT_CLIENT_ID,
            clean: true,
        },
    });
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: API_VERSION,
    });
    const corsOptions = !process.env.ALLOWED_ORIGINS || process.env.ALLOWED_ORIGINS === '*'
        ? '*'
        : process.env.ALLOWED_ORIGINS.split(',');
    app.enableCors({
        origin: corsOptions,
        credentials: true,
        methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.use((0, express_1.json)({ limit: '50mb' }));
    app.use(error_handler_1.errorHandler);
    app.use((0, helmet_1.default)());
    const host = process.env.HOST || 'http://localhost';
    const port = configService.get('app.port') || 3003;
    const config = new swagger_1.DocumentBuilder()
        .setTitle('CmonIoT Auth Api Swagger Service')
        .setDescription('CmonIoT API with MQTT & Socket.io Integration')
        .setVersion('1.0.1')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'default')
        .addTag('auth', 'signinuser')
        .addTag('users', 'me')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'Token' }, 'access-token')
        .addServer(`${host}:${port}`, 'Current Server')
        .addServer(`http://localhost:${port}`, 'Localhost')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/document', app, document, {
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
    await app.startAllMicroservices();
    await app.listen(port, () => {
        console.log(' ✅ IP=>' + IP + ' 🟡 NETMASK=>' + NETMASK + ' 🔴 GETWAY=>' + GETWAY);
        console.log(' ✅ MQTT_HOST_IP=>' +
            MQTT_HOST_IP +
            ' 🔌 MQTT_PORT=>' +
            MQTT_PORT +
            ' 🟢 MQTT_HOST=>' +
            MQTT_HOST);
        console.log(' ✅ MQTT_ADDR=>' + MQTT_ADDR);
        console.log(` 🟢 CmonIoT Nest ✅ app is listening on 🚀 port ${port}`);
        console.log(` 📡 Socket.io is running on the same port`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map