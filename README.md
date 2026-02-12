
# Development
# แก้ ไข full code
# http://localhost:3003/document
# sudo reboot now

var API_VERSION = '1';
ubuntu 
1. lan set ip static
IP = 172.25.99.10
NETMASK = 255.255.255.0
GETWAY = 172.25.99.1
2.set firewall 
3.allow filrewall

create file setnetwork.sh

- npm install bcryptjs
- npm i @types/bcryptjs

# production
 

# Stop and remove existing containers
docker-compose down

# Build and start with updated configuration
docker-compose up --build -d

docker-compose -f docker-compose-development.yml up
docker-compose -f docker-compose-production.yml up

# Stop services
docker-compose -f docker-compose-development.yml down
docker-compose -f docker-compose-production.yml down




# Stop and remove existing containers
docker-compose down

# Build and start with updated configuration
docker-compose up --build -d

# View logs
docker-compose logs -f app

# Check status
docker-compose ps

# Restart only app service
docker-compose restart app

# ########################
# ########################
# ########################
# ########################
 
docker builder prune

docker buildx prune

docker-compose up --build 

docker-compose up

docker system prune

docker system prune -a

docker compose build --no-cache

docker compose up --no-cache

docker system prune --all --force

# Development
docker-compose up -d

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# ดู logs
docker-compose logs -f app

# หยุด services
docker-compose down


# ตรวจสอบ container status
docker ps -a

# ดู logs
docker logs backendcmon

# เข้าไปใน container
docker exec -it backendcmon /bin/sh

# Rebuild โดยไม่ใช้ cache
docker-compose build --no-cache

# ลบทุกอย่างแล้ว restart
docker-compose down -v
docker-compose up -d --build


การตั้งค่า Jenkins
1. Required Plugins
bash
# Install via Jenkins Plugin Manager
- Docker Pipeline

# Clear Docker cache
docker-compose down -v
docker system prune -f

# Rebuild
docker-compose build --no-cache
docker-compose up


- Git Plugin
- Slack Notification (optional)
- Email Extension Plugin
- Credentials Plugin
- Pipeline Utility Steps
2. Credentials Setup
text
Jenkins → Manage Jenkins → Credentials

Add:
- ID: docker-hub-credentials
  Type: Username with password
  Username: your-docker-username
  Password: your-docker-password
3. Environment Variables (Optional)
text
Jenkins → Manage Jenkins → Configure System → Global properties

Add:
- SLACK_WEBHOOK_URL: https://hooks.slack.com/services/xxx
- DEFAULT_EMAIL: devops@example.com
การใช้งาน
bash
# Main Pipeline - Full CI/CD
# Triggered automatically on git push or manually

# Deploy Only Pipeline
# Use when you want to deploy existing image

# Rollback Pipeline
# Use when you need to rollback to previous version
การปรับปรุงที่สำคัญ
Security & Quality

เพิ่ม Trivy security scanning​

NPM audit สำหรับตรวจสอบ vulnerabilities

Code quality checks (lint, format)

Database backup ก่อน production deployment

Deployment

Zero-downtime deployment สำหรับ production

Health check verification

Smoke tests หลัง deployment

Rollback pipeline แยกต่างหาก

Monitoring & Notifications

Slack และ Email notifications

Build artifacts archiving

Detailed logging และ status reporting

Pipeline parameters สำหรับความยืดหยุ่น

Performance

Parallel stages (ถ้าเป็นไปได้)

Docker layer caching

Image cleanup อัตโนมัติ

Shallow git clone





2. cd backend


# Deploy แบบเต็ม
./deploy.sh

# หรือใช้แบบแยก stack
 sudo chmod -R 777 /home/cmon/appcmon/backend/docker/postgres/dbdata
./deploy-stack.sh up

# Health check
./deploy.sh health

# View logs
./deploy.sh logs
sudo chmod -R 777 /home/cmon/appcmon
sudo chmod -R 777 /home/cmon/appcmon/icmonapi
sudo chmod -R 777 /home/cmon/appcmon/databasee/docker/postgres/dbdata
docker-compose up build --no-cache

 sudo chmod -R 777 /home/cmon/appcmon/databasee/docker/postgres/dbdata
docker-compose -f docker-compose.base.yml -f docker-compose.app.yml -f docker-compose.admin.yml up -d

การใช้งาน

# Setup development environment
./scripts/setup-env.sh development

# Setup production environment
./scripts/setup-env.sh production

# Check security
./scripts/check-env-security.sh

# Set proper permissions
chmod 600 .env
chmod +x scripts/*.sh





วิธีการใช้งาน
รันทั้งหมด (แบบเดิม)
bash
docker-compose -f docker-compose.base.yml -f docker-compose.app.yml -f docker-compose.admin.yml up -d
รันเฉพาะฐานข้อมูล
bash
docker-compose -f docker-compose.base.yml up -d
รันแอปพลิเคชันพร้อมฐานข้อมูล
bash
docker-compose -f docker-compose.base.yml -f docker-compose.app.yml up -d
รันเครื่องมือจัดการ
bash
docker-compose -f docker-compose.base.yml -f docker-compose.admin.yml up -d

 สร้างไฟล์สำหรับ environment ต่างๆ:
docker-compose.dev.yml - สำหรับ development
docker-compose.prod.yml - สำหรับ production
docker-compose.test.yml - สำหรับ testing





# Search in your project directory
grep -r "FgQ" /home/cmon/appcmon/backend/

# Check your .env file
grep "FgQ" /home/cmon/appcmon/backend/.env

# Check Dockerfile
grep "FgQ" /home/cmon/appcmon/backend/Dockerfile
docker-compose down
docker-compose up --build 
docker-compose up -d


# sudo chmod -R 777 /home/cmon/appcmon/backend/docker/postgres/dbdata
# sudo chmod -R 777 /home/cmon/appcmon/backend

sudo chmod -R 777 /home/cmon/appcmon
sudo chmod -R 777 /home/cmon/appcmon/mqtt
sudo chmod -R 777 /home/cmon/appcmon/iot
sudo chmod -R 777 /home/cmon/appcmon/codeigniter3
sudo chmod -R 777 /home/cmon/appcmon/backend
sudo chmod -R 777 /home/cmon/appcmon/mongodb


# docker-compose up --build -d  
# docker ps   
# docker-compose up --build -d app  
# docker-compose up --build -d postgres  
# docker-compose up --build -d redis  
# docker-compose up --build -d pgadmin  
# docker-compose up --build -d redis-commander  
# docker-compose up 
# docker-compose up app
# docker-compose up postgres
# docker-compose up redis
# docker-compose up pgadmin
# docker-compose up redis-commander
# docker ps  

# Using npm
sudo npm install -g @nestjs/cli
# Or using yarn
sudo npm install -g yarn
yarn global add @nestjs/cli
# Generate the resource

nest g resource modules/kafka

# Check what's using PostgreSQL port
sudo lsof -i :5432

# Check what's using Redis port  
sudo lsof -i :6379

sudo chmod -R 777 /home/cmon/appcmon/backend

# Check for any running Docker containers
docker ps


# Make the script executable
chmod +x deploy.sh
# Run deployment
./deploy.sh






2. cd backend
# docker-compose up --build app -d 
# docker-compose up app
# docker-compose down backendcmon
# docker-compose down app
# sudo chmod -R 777 /home/cmon/appcmon
# docker-compose up --build -d app 
# docker-compose down app
# docker-compose up app
# docker-compose up --build -d app  
# docker-compose up --build -d postgres  
# docker-compose down postgres
# docker-compose up --build -d redis  
# docker-compose up --build -d pgadmin  
# docker-compose up --build -d redis-commander  
# docker-compose up 
# docker-compose up postgres
# docker-compose up redis
# docker-compose up pgadmin
# docker-compose up redis-commander
# docker ps  


# sudo chmod -R 777 /home/cmon/appcmon/backend/docker/postgres/dbdata
# docker-compose up --build -d 


```bash
    try {
        ////////////////
    } catch (error) {
        ////////////////
        return res.status(500).json({
                statusCode: 500,
                code: 500,
                payload: { }, 
                message: 'Internal server error 500',
                message_th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์ 500',
                error: error.message || error,
        });
    }
    
backendcmon  | [Nest] 30  - 08/25/2025, 11:05:04 PM   ERROR [MailerService] Transporter is ready
backendcmon  | [Nest] 30  - 08/25/2025, 11:05:04 PM   ERROR [MailerService] Transporter is ready

docker version
docker-compose version 
docker ps -a -s
-----------
sudo chmod -R 777 /home/cmon/GitHub
sudo chmod -R 777 /home/cmon/appcmon/backend
sudo chown -R 999:999 /home/cmon/appcmon/backend/docker/postgres/dbdata
sudo chown -R $(id -u):$(id -g) /home/cmon/appcmon/backend/docker/postgres/dbdata
sudo chmod -R 777 /home/cmon/appcmon/backend/docker/postgres/dbdata
-------------
sudo chmod -R 777 /home/cmon/appcmon
clear
docker compose down app
docker compose up --build app
docker compose up 
docker ps -a
-----------
# Stop the container (replace <container_id_or_name>)
docker stop my_container
docker stop xxxx
docker stop 
-----------
docker stop c386d7d114f2
-----------
# Remove the container
docker rm my_container
-----------
docker rm c386d7d114f2
-----------
# List images to find the ID/name
docker images
-----------
# Remove the image (replace <image_id_or_name>)
docker rmi my_image:latest
docker rmi xxx
----------- 
docker kill
-----------
docker kill my_container
docker kill --signal=SIGHUP  my_container
docker kill --signal=SIGHUP my_container
docker kill --signal=HUP my_container
docker kill --signal=1 my_container
-----------
docker stop my_container
docker stop xxxx
docker stop 
-----------
docker ps -a
-----------
docker stop 75a191f30c73
-----------
# Remove the container
docker rm my_container
-----------
docker rm 75a191f30c73
-----------
docker rmi nginx:alpine  
-----------

```
cminiotapp
icmon0955@gmail.com
ccwa ijti eouj bojk

U:icmon0955@gmail.com P:ccwaijtieoujbojk


    MailerModule.forRoot({ 
        // transport: {
        //             host: "172.29.16.52",
        //             port: 587,
        //             secure: false,
        //             auth: {
        //               user: "strux.ware",
        //               pass: 'baac@123',
        //             },
        //             tls: {
        //                 rejectUnauthorized: false
        //             }
        //           },
        //         defaults: {
        //           from: '"No Reply" <IoTcmon>',
        //         },
        

        //  zip -r postgres_db.zip  postgres
        
        transport: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true, // true for port 465, false for port 587
                auth: {
                  user: 'icmon0955@gmail.com',
                  pass: 'ccwaijtieoujbojk',
                },
                tls: {
                    rejectUnauthorized: false
                } 

        },
        defaults: {
                from: '"No Reply" <cmoniots@gmail.com>',
        },
          // template: {
          //   dir: join(__dirname, 'templates'),
          //   adapter: new HandlebarsAdapter(),
          //   options: { strict: true },
          // },
     }),
  ], 
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">This template serves as a boiler plate for nestjs application with authentication feature with postgres using typeorm.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description
# 
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash

 node v22.22.0
 npm  v10.9.4

nvm use 22.22.0

$ nvm ls   
$ node -v  
- v21.1.0
$ npm -v
- 10.2.0
$ npm install  
$ npm i -g @nestjs/cli
$ npm audit fix --force
$ npm fund
$ npm install --save @nestjs/typeorm typeorm pg

npm install --legacy-peer-deps

  "scripts": {
    "prebuild": "rimraf dist",
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/src/main",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "lint": "eslint ./src -c .eslintrc.json --max-warnings=0",
    "lint:fix": "eslint ./src -c .eslintrc.json --fix",
    "typeorm": "typeorm-ts-node-commonjs -d src/config/db/orm.config.ts",
    "migration:run": "npm run typeorm migration:run",
    "migration:revert": "npm run typeorm migration:revert",
    "migration:generate": "npm run typeorm migration:generate ./migrations/$npm_config_key",
    "migration:create": "typeorm migration:create ./migrations/$npm_config_key",
    "migration:show": "npm run typeorm migration:show",
    "prepare": "husky install",
    "heroku-postbuild": "npm run build --only=dev"
  },
  
- .env
API_URL=http://localhost:3003
HOST=localhost
PORT=3003
SECRET_KEY=Na@0955##
APP_SECRET=Na@0988
DATABASE_HOST=localhost
DATABASE_NAME=nest_cmon
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=root
DATABASE_PORT=5432 
RUN_MIGRATIONS=true
RUN_MIGRATIONS=true
MODE=DEV

{
  "userName": "kongnakornna",
  "email": "kongnakornna@gmail.com",
  "password": "Na@0955",
  "isActive": true,
  "status": "supervisor",
  "lastLogin": null
}
```
## Database
```bash
  - postgres
  - Sqllite
  - redis cache
  - InfluxDB
  - MongoDB

``

## Running the app

Before running the npm commands, please make sure you have the Node and npm versions described in package.json

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

- node v v22.12.0
- npm -v  10.9.0
## Dockerfile

```bash
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production

COPY . .

RUN npm run build

EXPOSE 3004

CMD ["npm", "run", "start:prod"]

```
## docker-compose.yml
```bash
version: '3'
services:
  nestjs-app:
    build: .
    ports:
      - "3004:3000"
    environment:
      - NODE_ENV=production


```

## Test

```bash
# unit tests
$ npm run test:e2e

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
 
$  npm run lint
$  npm run format


```


## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Deployment

This application is also deployed on [vercel](https://nestjs-jwt-auth-postgres-type-jmeslp9d4.vercel.app/api)

## Stay in touch

- Author - [Bilal ur Rehman](https://github.com/BilalurRehman-27)
- LinkedIn - [BilalurRehman](https://www.linkedin.com/in/bilal-ur-rehman/)

## License

Nest is [MIT licensed](LICENSE).

# http://localhost:3003

```bash

UPDATE "public"."user" SET "isActive" = '1',email='kongnakornna@gmail.com' WHERE "id" = 'a114a71f-8dca-4004-b468-59797cb34d53'

{{base_url}}/v1/users/me

npm i @nestjs/mongoose argon2  cache-manager-redis-yet mongoose redis reflect-metadata @nestjs/cache-manager cache-manager -S
npm i cache-manager-redis-store -S    
npm i util axios redis ioredis ioredis-timeout moment -S
npm i --save @nestjs/event-emitter
npm install --save swagger-jsdoc@latest swagger-ui-express@latest

npm install --save  @nestjs-modules/mailer
npm install --save @nestjs-modules/mailer nodemailer
npm install --save-dev @types/nodemailer
npm install --save @nestjs-modules/mailer @nestjs/cache-manager @nestjs/common @nestjs/config @nestjs/core @nestjs/event-emitter @nestjs/jwt @nestjs/mapped-types @nestjs/mongoose @nestjs/passport @nestjs/platform-express @nestjs/swagger @nestjs/typeorm 
npm audit fix
npm i --save @influxdata/influxdb-client
npm i --save @influxdata/influxdb-client-apis
npm install --save @nestjs/common @nestjs/core @nestjs/platform-express @influxdata/influxdb-client


- Node-Red

 
node-red-node-random
node-red-contrib-influxdb
node-red-dashboard
node-red-contrib-mdashboard

 
http://192.168.1.37:1880/ui/
http://172.25.99.10:1881/ui/
IP=172.25.99.10
MASK=255.255.255.240
GW=172.25.99.62
-----------------

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_ID=cmoniots@gmail.com
EMAIL_PASS=cmoniots@0955#

EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_ID=kongnakornjantakun@outlook.com
EMAIL_PASS=Pumipat@0955

 
export INFLUX_URL=https://cloud2.influxdata.com
export INFLUX_TOKEN=API_TOKEN
export INFLUX_ORG=ORG_ID
export INFLUX_BUCKET=BUCKET_NAME

# https://typeorm.io/
# http://172.25.99.10:8086/

IP=172.25.99.10
MASK=255.255.255.240
GW=172.25.99.62

# pm2
pm2 start npm --name cmonapi -- start --port 3004
pm2 list
pm2 start npm run start:dev --name cmonapidev
 
pm2 start "npm run dev" --name "nextjs server"

and whenever I need to check logs i do

pm2 logs "nexjs server"

if i update files sometimes it automatically propagates when i use git but sometimes it does not so you can do

pm2 restart cmonapidev server

or

pm2 stop cmonapidev server

pm2 start cmonapidev server


pm2 logs cmonapidev

pm2 delete cmonapidev


With NPM
$ npm install pm2 -g
With Bun
$ bun install pm2 -g
To list all running applications:

$ pm2 list
Managing apps is straightforward:

$ pm2 stop     <app_name|namespace|id|'all'|json_conf>
$ pm2 restart  <app_name|namespace|id|'all'|json_conf>
$ pm2 delete   <app_name|namespace|id|'all'|json_conf>
To have more details on a specific application:

$ pm2 describe <id|app_name>

To monitor logs, custom metrics, application information:

$ pm2 monit
Starting a Node.js application in cluster mode that will leverage all CPUs available:

$ pm2 start api.js -i <processes>
Zero Downtime Reload

Hot Reload allows to update an application without any downtime:

$ pm2 reload all

More informations about how PM2 make clustering easy

Container Support
With the drop-in replacement command for node, called pm2-runtime, run your Node.js application in a hardened production environment. Using it is seamless:

RUN npm install pm2 -g
CMD [ "pm2-runtime", "npm", "--", "start" ]
Read More about the dedicated integration

Host monitoring speedbar
PM2 allows to monitor your host/server vitals with a monitoring speedbar.

To enable host monitoring:

$ pm2 set pm2:sysmonit true
$ pm2 update
o consult logs just type the command:

$ pm2 logs
Standard, Raw, JSON and formated output are available.

Examples:
nestjs docker   Dockerfile docker-compose  nustjs ไม่ใช่ nextjs

$ pm2 logs APP-NAME       # Display APP-NAME logs
$ pm2 logs --json         # JSON output
$ pm2 logs --format       # Formated output

$ pm2 flush               # Flush all logs
$ pm2 reloadLogs          # Reload all logs
To enable log rotation install the following module

$ pm2 install pm2-logrotate

pm2 start <ชื่อไฟล์ entry point>.js
pm2 start dist/src/main.js
pm2 delete dist/src/main.js
pm2 delete cmonapidev



yarn global add pm2

# Stop services only
docker-compose stop

# Stop and remove containers, networks..
docker-compose down 
docker-compose down --rmi cmonapis-nestjs-app


# Down and remove volumes
docker-compose down --volumes 

# Down and remove images
docker-compose down --rmi <all|local> 

docker compose sqlite nestjs nodejs 22.12 +github

search: nodejs version v22 +NustJS +docker compose+ sqlite3 +gihhub


# AI  ollama run deepseek-r1:7b


  if (dto.public_notification) {
      DataUpdate.public_notification = dto.public_notification;
  }

  if (dto.sms_notification) {
      DataUpdate.sms_notification = dto.sms_notification;
  }

 if (dto.email_notification) {
      DataUpdate.email_notification = dto.email_notification;
  }


'u.public_notification AS public_notification',
'u.sms_notification AS sms_notification',
'u.email_notification AS email_notification',


public_notification:Profile.public_notification, 
sms_notification:Profile.sms_notification, 
email_notification:Profile.email_notification, 

IP=172.25.99.10
MASK=255.255.255.240
GW=172.25.99.62
API_URL=http://127.0.0.1:3003
HOST=http://127.0.0.1


 
SELECT 
  "d"."device_id" AS device_id, 
  "d"."mqtt_id" AS mqtt_id, 
  "d"."setting_id" AS setting_id, 
  "sad"."alarm_action_id" AS alarm_action_id, 
  "d"."type_id" AS type_id, 
  "d"."device_name" AS device_name, 
  "d"."hardware_id" AS hardware_id, 
  "d"."status_warning" AS status_warning, 
  "d"."recovery_warning" AS recovery_warning, 
  "d"."status_alert" AS status_alert, 
  "d"."recovery_alert" AS recovery_alert, 
  "d"."time_life" AS time_life, 
  "d"."period" AS period, 
  "d"."work_status" AS work_status, 
  "d"."mqtt_data_value" AS mqtt_data_value, 
  "d"."mqtt_data_control" AS mqtt_data_control, 
  "d"."model" AS model, 
  "d"."vendor" AS vendor, 
  "d"."comparevalue" AS comparevalue, 
  "d"."createddate" AS createddate, 
  "d"."updateddate" AS updateddate, 
  "d"."status" AS status, 
  "d"."action_id" AS action_id, 
  "d"."status_alert_id" AS status_alert_id, 
  "d"."measurement" AS measurement, 
  "d"."mqtt_control_on" AS mqtt_control_on, 
  "d"."mqtt_control_off" AS mqtt_control_off, 
  "d"."org" AS device_org, 
  "d"."bucket" AS device_bucket, 
  "t"."type_name" AS type_name, 
  "l"."location_name" AS location_name, 
  "l"."configdata" AS configdata, 
  "mq"."mqtt_name" AS mqtt_name, 
  "mq"."org" AS mqtt_org, 
  "mq"."bucket" AS mqtt_bucket, 
  "d"."mqtt_device_name" AS mqtt_device_name, 
  "d"."mqtt_status_over_name" AS mqtt_status_over_name, 
  "d"."mqtt_status_data_name" AS mqtt_status_data_name, 
  "d"."mqtt_act_relay_name" AS mqtt_act_relay_name, 
  "d"."mqtt_control_relay_name" AS mqtt_control_relay_name, 
  "alarm"."alarm_action_id" AS alarm_action_id, 
  "alarm"."action_name" AS action_name, 
  "alarm"."status_warning" AS status_warning, 
  "alarm"."recovery_warning" AS recovery_warning, 
  "alarm"."status_alert" AS status_alert, 
  "alarm"."recovery_alert" AS recovery_alert, 
  "alarm"."email_alarm" AS email_alarm, 
  "alarm"."line_alarm" AS line_alarm, 
  "alarm"."telegram_alarm" AS telegram_alarm, 
  "alarm"."sms_alarm" AS sms_alarm, 
  "alarm"."nonc_alarm" AS nonc_alarm, 
  "alarm"."time_life" AS time_life, 
  "alarm"."event" AS event, 
  "alarm"."status" AS status 
FROM 
  "public"."sd_iot_device" "d" 
  INNER JOIN "public"."sd_iot_alarm_device" "sad" ON "sad"."device_id" = "d"."device_id" 
  INNER JOIN "public"."sd_iot_device_alarm_action" "alarm" ON "alarm"."alarm_action_id" = "sad"."alarm_action_id" 
  INNER JOIN "public"."sd_iot_setting" "st" ON "st"."setting_id" = "d"."setting_id" 
  INNER JOIN "public"."sd_iot_device_type" "t" ON "t"."type_id" = "d"."type_id" 
  INNER JOIN "public"."sd_iot_mqtt" "mq" ON "mq"."mqtt_id" = "d"."mqtt_id" 
  INNER JOIN "public"."sd_iot_location" "l" ON "l"."location_id" = "mq"."location_id" 
WHERE 
  1 = 1 
  AND "d"."status" = 1 
  AND "mq"."status" = 1 
  AND "alarm"."status" = 1 
  AND "sad"."alarm_action_id" = 1
  AND "d"."device_id" = 8
ORDER BY 
  "mq"."sort" ASC, 
  "d"."device_id" ASC 
  
  
  -- PARAMETERS: [1,1,8]


SELECT 
  COUNT(1) AS "cnt" 
FROM 
  "public"."sd_alarm_process_log" "l" 
WHERE 
  1 = 1 
  AND "l"."alarm_action_id" = 1
  AND "l"."device_id" = 8
  AND "l"."type_id" = 1
  AND "l"."date" = '2025-08-24'

CREATE INDEX idx_alarm_created ON sd_alarm_process_log_temp(createddate DESC);
CREATE INDEX idx_alarm_device ON sd_alarm_process_log_temp(device_id);
CREATE INDEX idx_alarm_action ON sd_alarm_process_log_temp(alarm_action_id);



from(bucket: "${InfluxDB_bucket}")
          |> range(start: -1h) 
          |> filter(fn: (r) => r["_measurement"] == "Envavorment")
          |> filter(fn: (r) => r["_field"] == "Amp"
          or r["_field"] == "Humidity" 
          or r["_field"] == "Latitude" 
          or r["_field"] == "Longitude"
          or r["_field"] == "Temperature" 
          or r["_field"] == "Temperature2" 
          or r["_field"] == "Voltage" 
          or r["_field"] == "sensors_Relay1")
          |> yield(name: "mean")


 var fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: ${start}, stop: ${stop})
        |> filter(fn: (r) => r["_measurement"] == "${measurement}")
        |> filter(fn: (r) => r["_field"] == "${field}")
        |> aggregateWindow(every: ${windowPeriod}, fn: last, createEmpty: false)
        |> limit(n:${limit}, offset: ${offset})
        |> yield(name: "${mean}")
    `;


from(bucket: "AIR1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => 
  r["_measurement"] == "ActRelay1" 
  or r["_measurement"] == "ActRelay2" 
  or r["_measurement"] == "ActRelay3" 
  or r["_measurement"] == "ContRelay1" 
  or r["_measurement"] == "ContRelay2" 
  or r["_measurement"] == "ContRelay3" 
  or r["_measurement"] == "IO1" 
  or r["_measurement"] == "IO2" 
  or r["_measurement"] == "IO3" 
  or r["_measurement"] == "temperature" 
  or r["_measurement"] == "OverIO3" 
  or r["_measurement"] == "OverIO2" 
  or r["_measurement"] == "OverIO1")
  |> aggregateWindow(every: v.windowPeriod, fn: mean, createEmpty: false)
  |> limit(n:100, offset: 0)
  |> yield(name: "mean")


broker.hivemq.com

MqttDataBot/CO2             CO2 Sensor - วัดความเข้มข้นคาร์บอนไดออกไซด์
MqttDataBot/CO              CO sensor  คาร์บอนมอนอกไซด์ (CO)
MqttDataBot/O3              O3 sensor โอโซน (O3)
MqttDataBot/CH4             Methane (CH4) Sensor - วัดก๊าซมีเทน
MqttDataBot/N20             Nitrous Oxide (N2O) Sensor - วัดก๊าซไนตรัสออกไซด์
MqttDataBot/EM              Energy Monitoring Sensor - วัดการใช้พลังงานไฟฟ้า
MqttDataBot/FF              Fuel Flow Sensor - วัดการใช้น้ำมันเชื้อเพลิง
MqttDataBot/temp            Temperature Sensor - วัดอุณหภูมิสำหรับคำนวณการใช้พลังงาน
MqttDataBot/humi            humidity Sensor - ความชื้นสำหรับคำนวณการใช้พลังงาน
MqttDataBot/dust            Dust sensor หรือเซ็นเซอร์ตรวจจับฝุ่น
MqttDataBot/NO2             NO2 sensor ไนโตรเจนไดออกไซด์ (NO2)
MqttDataBot/VOC             VOCs sensor สารระเหยอินทรีย์ (VOCs)

 
จากที่ได้คุยทางโทรศัพท์ ลูกค้า ขอจัดทำใบเสนอราคาสำหรับงานติดตั้งระบบและจัดหาอุปกรณ์หลักสำหรับโครงการ MMR2 / MMR3: สถานีเคเบิลใต้น้ำโมฬี จังหวัดระยอง
โดยมีขอบเขตงานและรายการอุปกรณ์ที่ต้องการดังต่อไปนี้
รายการระบบ / อุปกรณ์
1) Power System (ระบบไฟฟ้ากำลัง) 
1.1 ATS (Automatic Transfer Switch)
1.2High Voltage System        
1.3Cable and Wire     รวมถึงงานติดตั้ง Tray/Bucket
2) Air conditioning System CRAC Units จำนวน 2 ชุด (สำหรับห้อง MMR2/MMR3) หรือตามแบบ
ข้อกำหนด: ระบบ Precision Air Conditioning, ความต้องการทำความเย็น DC=100kW,AC=78kW, ระบบ N+1     
3) UPS (เครื่องสำรองไฟฟ้า)    
UPS ขนาด 250 KVA จำนวน 2 ชุด (ระบบ 2N) ข้อกำหนด: Backup time ไม่น้อยกว่า 15 นาที
4) Equipment Rack and Rack power system       
4.1Equipment Rack ขนาดต่างๆ รวมประมาณ 36 ตู้ (60×30,60×60,60×80)
4.2Rack Power System ระบบจ่ายไฟสำหรับตู้แร็ค (PDUs)
5)Grounding ระบบสายดิน (กราวด์) และงานติดตั้งที่เกี่ยวข้อง
6 )Monitoring (ASD) 
ระบบเฝ้าระวัง (Aspirating Smoke Detector - ASD/Vesda) และ Water Leak Detection
7) Security System (ระบบรักษาความปลอดภัย)      
7.1. CCTV ระบบกล้องวงจรปิด
7.2. Access control ระบบควบคุมการเข้าออก (ACC)
- หมายเหตุ / ข้อกำหนดหลัก (อ้างอิงจากเอกสารแนบ)
สิ่งที่ต้องการจากใบเสนอราคา
ราคาอุปกรณ์ต่อหน่วยและราคารวมของแต่ละรายการ
ค่าติดตั้งและค่าแรงโดยละเอียด (แยกส่วน Supply และ Installation)
ระยะเวลาในการจัดส่งและติดตั้ง (Lead Time)
เงื่อนไขการชำระเงิน และระยะเวลารับประกัน (Warranty Period)
สเปคทางเทคนิคของอุปกรณ์ที่เสนอ (Technical Specification)


 "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
    "start:prod": "cross-env NODE_ENV=production  node dist/src/main",
    "start:staging": "cross-env NODE_ENV=staging nest start --watch",



CMD ["npm", "run", "start:dev"]
CMD ["npm", "run", "start:debug"]
CMD ["npm", "run", "start:staging"]
CMD ["npm", "run", "start:prod"]


# หยุด containers ทั้งหมด
docker-compose down
# ลบ cache, volumes และ images ที่ไม่ใช้
docker system prune -a --volumes
# กด y เพื่อยืนยัน
# 1. ล้าง Docker cache
docker system prune -a --volumes
# 2. Build ใหม่โดยไม่ใช้ cache
docker-compose build --no-cache
# 3. รัน container
docker-compose up
# หรือรันแบบ background
docker-compose up -d
# ดู logs
docker-compose logs -f
# หยุดและลบทุกอย่าง
docker-compose down -v
# ลบ image เฉพาะ
docker rmi icmonapi-app
# Build และรันใหม่
docker-compose up --build --force-recreate

# npm run start:dev



from(bucket: "AIRCOM1")
	|> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "air1alarm" or r["_measurement"] == "mode" or r["_measurement"] == "humidityalarm" or r["_measurement"] == "humidity" or r["_measurement"] == "hssdalarm" or r["_measurement"] == "firealarm" or r["_measurement"] == "percent" or r["_measurement"] == "period" or r["_measurement"] == "recovery" or r["_measurement"] == "stateair1" or r["_measurement"] == "stateair2" or r["_measurement"] == "temperature" or r["_measurement"] == "temperaturealarm" or r["_measurement"] == "temperaturealarmoff" or r["_measurement"] == "ups1alarm" or r["_measurement"] == "ups2alarm" or r["_measurement"] == "warning" or r["_measurement"] == "waterleakalarm" or r["_measurement"] == "air2alarm")
  |> filter(fn: (r) => r["_field"] == "value")



from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 10s, fn: mean, createEmpty: false)
  |> yield(name: "mean")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 10s, fn: median, createEmpty: false)
  |> yield(name: "median")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 10s, fn: max, createEmpty: false)
  |> yield(name: "max")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 10s, fn: sum, createEmpty: false)
  |> yield(name: "sum")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> derivative(unit: 1s, nonNegative: false)
  |> yield(name: "derivative")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> derivative(unit: 1s, nonNegative: true)
  |> yield(name: "nonnegative derivative")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> sort()
  |> yield(name: "sort")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> unique()
  |> yield(name: "unique")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 10s, fn: last, createEmpty: false)
  |> yield(name: "last")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 10s, fn: first, createEmpty: false)
  |> yield(name: "first")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 10s, fn: stddev, createEmpty: false)
  |> yield(name: "stddev")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> spread()
  |> yield(name: "spread")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> distinct()
  |> yield(name: "distinct")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> count()
  |> yield(name: "count")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> increase()
  |> yield(name: "increase")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> skew()
  |> yield(name: "skew")

from(bucket: "AIRCOM1")
  |> range(start: v.timeRangeStart, stop: v.timeRangeStop)
  |> filter(fn: (r) => r["_measurement"] == "waterleakalarm")
  |> filter(fn: (r) => r["_field"] == "value")
  |> aggregateWindow(every: 10s, fn: min, createEmpty: false)
  |> yield(name: "min")


nest g resource <name>

nest g resource modules/mqtt2


- CMONBUGKET

{"0":"temperature1","1":"humidity1","2":"temperature2","3":"humidity2","4":"temperature3","5":"input1","6":"AIR1","7":"AIR2","8":"UPS1","9":"UPS2","10":"Fire","11":"waterleak","12":"HSSD","13":"Temp"}

- LDRBUGKET

{"0":"temperature","1":"humidity","2":"lux","3":"input1status","4":"input2status","5":"outstatus"}


  var ResultData:any=await this.mqtt2Service.alarm_device_paginate_status(filter2); 




SELECT "d"."device_id" AS device_id, "d"."type_id" AS type_id, "d"."hardware_id" AS hardware_id, "t"."type_name" AS type_name, "d"."device_name" AS device_name, "d"."status_warning" AS status_warning, "d"."recovery_warning" AS recovery_warning, "d"."status_alert" AS status_alert, "d"."recovery_alert" AS recovery_alert, "d"."time_life" AS time_life, "d"."period" AS period, "d"."model" AS model, "d"."vendor" AS vendor, "d"."status" AS status, "d"."unit" AS unit, "d"."mqtt_id" AS mqtt_id, "d"."mqtt_data_value" AS mqtt_data_value, "d"."mqtt_data_control" AS mqtt_data_control, "d"."mqtt_control_on" AS mqtt_control_on, "d"."mqtt_control_off" AS mqtt_control_off, "d"."measurement" AS measurement, "l"."location_name" AS location_name, "mq"."mqtt_name" AS mqtt_name, "mq"."org" AS mqtt_org, "mq"."bucket" AS mqtt_bucket, "mq"."envavorment" AS mqtt_envavorment, "d"."max" AS max, "d"."min" AS min, "d"."action_id" AS action_id, "mq"."host" AS mqtt_host, "mq"."port" AS mqtt_port, "d"."mqtt_device_name" AS mqtt_device_name, "d"."mqtt_status_over_name" AS mqtt_status_over_name, "d"."mqtt_status_data_name" AS mqtt_status_data_name, "d"."mqtt_act_relay_name" AS mqtt_act_relay_name, "d"."mqtt_control_relay_name" AS mqtt_control_relay_name FROM "public"."sd_iot_device" "d" LEFT JOIN "public"."sd_iot_setting" "st" ON "st"."setting_id"= "d"."setting_id"  LEFT JOIN "public"."sd_iot_device_type" "t" ON "t"."type_id" = "d"."type_id"  LEFT JOIN "public"."sd_iot_mqtt" "mq" ON "mq"."mqtt_id" = "d"."mqtt_id"  LEFT JOIN "public"."sd_iot_location" "l" ON "l"."location_id"= "d"."location_id" 
WHERE 1=1 AND "d"."hardware_id"=2
AND "d"."bucket" ='LDRBUGKET'
ORDER BY "mq"."sort" ASC, "d"."device_id" ASC LIMIT 1000 OFFSET 0 


 
SELECT 
  "d"."device_id" AS device_id, 
  "d"."type_id" AS type_id, 
  "d"."hardware_id" AS hardware_id, 
  "t"."type_name" AS type_name, 
  "d"."device_name" AS device_name, 
  "d"."status_warning" AS status_warning, 
  "d"."recovery_warning" AS recovery_warning, 
  "d"."status_alert" AS status_alert, 
  "d"."recovery_alert" AS recovery_alert, 
  "d"."time_life" AS time_life, 
  "d"."period" AS period, 
  "d"."model" AS model, 
  "d"."vendor" AS vendor, 
  "d"."status" AS status, 
  "d"."unit" AS unit, 
  "d"."mqtt_id" AS mqtt_id, 
  "d"."mqtt_data_value" AS mqtt_data_value, 
  "d"."mqtt_data_control" AS mqtt_data_control, 
  "d"."mqtt_control_on" AS mqtt_control_on, 
  "d"."mqtt_control_off" AS mqtt_control_off, 
  "d"."measurement" AS measurement, 
  "l"."location_name" AS location_name, 
  "mq"."mqtt_name" AS mqtt_name, 
  "mq"."org" AS mqtt_org, 
  "mq"."bucket" AS mqtt_bucket, 
  "mq"."envavorment" AS mqtt_envavorment, 
  "d"."max" AS max, 
  "d"."min" AS min, 
  "d"."action_id" AS action_id, 
  "mq"."host" AS mqtt_host, 
  "mq"."port" AS mqtt_port, 
  "d"."mqtt_device_name" AS mqtt_device_name, 
  "d"."mqtt_status_over_name" AS mqtt_status_over_name, 
  "d"."mqtt_status_data_name" AS mqtt_status_data_name, 
  "d"."mqtt_act_relay_name" AS mqtt_act_relay_name, 
  "d"."mqtt_control_relay_name" AS mqtt_control_relay_name 
FROM 
  "public"."sd_iot_device" "d" 
  LEFT JOIN "public"."sd_iot_setting" "st" ON "st"."setting_id" = "d"."setting_id" 
  LEFT JOIN "public"."sd_iot_device_type" "t" ON "t"."type_id" = "d"."type_id" 
  LEFT JOIN "public"."sd_iot_mqtt" "mq" ON "mq"."mqtt_id" = "d"."mqtt_id" 
  LEFT JOIN "public"."sd_iot_location" "l" ON "l"."location_id" = "d"."location_id" 
WHERE 
  1 = 1 
  AND "d"."hardware_id" = 2 
  AND "d"."bucket" = 'LDRBUGKET' 
ORDER BY 
  "mq"."sort" ASC, 
  "d"."device_id" ASC 
LIMIT 
  1000 OFFSET 0



``` 

The command `nest generate resource` (or `nest g res`) is a powerful command in NestJS CLI to generate a complete CRUD resource module. Here's a comprehensive guide:

## What it generates

This command creates a complete CRUD module with:
- **Module** file
- **Controller** with basic CRUD endpoints
- **Service** with business logic
- **DTOs** (Create and Update)
- **Entity** class (for TypeORM/Prisma)
- **Test files**

## Basic Usage

```bash
# Full command
nest generate resource <name>

# Short version
nest g res <name>

# Example
nest g res users
```

## Command Options

```bash
nest g res <name> [options]
```

### Common Options:

| Option | Description | Default |
|--------|-------------|---------|
| `--dry-run` | Preview changes without writing files | false |
| `--flat` | Generate files in src/ instead of subdirectory | false |
| `--no-spec` | Skip test files | false |
| `--skip-import` | Skip importing in parent module | false |

## Database Integration Options

When running the command, you'll be prompted for:

1. **What transport layer do you use?**
   - `REST API` (default)
   - `GraphQL (code first)`
   - `GraphQL (schema first)`
   - `Microservice (non-HTTP)`
   - `WebSockets`

2. **Would you like to generate CRUD entry points?**
   - `Yes` (default) - generates full CRUD endpoints
   - `No` - generates only the module structure

## Examples

### 1. Generate a REST API resource
```bash
nest g res products
# Choose: REST API → Yes (for CRUD)
```

### 2. Generate a GraphQL resource
```bash
nest g res customers
# Choose: GraphQL (code first) → Yes
```

### 3. Generate without CRUD endpoints
```bash
nest g res auth
# Choose: REST API → No
```

### 4. With specific path
```bash
nest g res modules/users
# Creates in src/modules/users/
```

## Generated Structure

For `nest g res users` (REST API with CRUD):

```
src/
  users/
    users.controller.ts
    users.controller.spec.ts
    users.service.ts
    users.service.spec.ts
    users.module.ts
    dto/
      create-user.dto.ts
      update-user.dto.ts
    entities/
      user.entity.ts
```

## Manual Specification

You can specify options directly without prompts:

```bash
# REST API with CRUD
nest g res users --no-spec --flat

# GraphQL resource
nest g res posts --type graphql-code-first

# Microservice
nest g res orders --type microservice
```

## Available Types for `--type` flag:

```bash
--type rest         # REST API (default)
--type graphql-code-first
--type graphql-schema-first
--type microservice
--type websocket
```

## Quick Examples

```bash
# Generate a blog module with REST API
nest g res articles

# Generate a chat module with WebSockets
nest g res messages --type websocket

# Generate a GraphQL resource for comments
nest g res comments --type graphql-code-first --no-spec


nest g module modules/messages
nest g controller modules/messages --no-spec
nest g service modules/messages --no-spec
nest g class modules/messages/messages.gateway --no-spec




  async AlarmDetailValidate(dto: any) {
    try {
      console.log('getAlarmDetails dto-->', dto);

      // 1. Parse และเตรียมข้อมูลพื้นฐาน
      const unit: string = dto.unit || '';
      let type_id: number = dto.type_id ? parseFloat(dto.type_id) : 0;

      // ใช้ alarmTypeId ถ้ามี ถ้าไม่มีใช้ type_id
      if (dto.alarmTypeId) {
        type_id = parseFloat(dto.alarmTypeId);
      }

      // 2. ประมวลผล sensorValues
      let sensorValues: any = dto.value_data;
      if (
        sensorValues !== null &&
        sensorValues !== undefined &&
        sensorValues !== ''
      ) {
        const sensorValueNum = parseFloat(sensorValues);
        if (!isNaN(sensorValueNum)) {
          sensorValues = sensorValueNum;
        }
      }
      // 3. กำหนดค่าพื้นฐาน
      var max: any = dto.max ?? '';
      var min: any = dto.min ?? '';
      const statusAlert: number = parseFloat(dto.status_alert) || 0;
      const statusWarning: number = parseFloat(dto.status_warning) || 0;
      const recoveryWarning: number = parseFloat(dto.recovery_warning) || 0;
      const recoveryAlert: number = parseFloat(dto.recovery_alert) || 0;
      const mqttName: string = ''; // dto.mqtt_name ถูกตั้งเป็น string ว่าง
      const deviceName: string = dto.device_name || '';
      const alarmActionName: string = dto.action_name || '';
      const mqttControlOn: string = dto.mqtt_control_on || '';
      const mqttControlOff: string = dto.mqtt_control_off || '';
      const count_alarm: number = parseFloat(dto.count_alarm) || 0;
      const event: number = parseFloat(dto.event) || 0;

      let dataAlarm: number = 999;
      let eventControl: number = event;
      let messageMqttControl: string =
        event === 1 ? mqttControlOn : mqttControlOff;

      // 4. ตัวแปรที่จะใช้ในเงื่อนไข
      let alarmStatusSet: number = 999;
      let subject: string = '';
      let content: string = '';
      let status: number = 5;
      let data_alarm: number = 0;
      let value_data: any = dto.value_data;
      let value_alarm: any = dto.value_alarm || '';
      let value_relay: any = dto.value_relay || '';
      let value_control_relay: any = dto.value_control_relay || '';
      let sensor_data: any = null;
      let title: any = 'Normal';

      // 5. ตรวจสอบ status warning

      // Parse ค่า sensor
      /**
       * 
        * function getStatusText($alarm_status) {
          switch($alarm_status) {
              case 1: return 'Critical';
              case 2: return 'Warning';
              case 3: return 'Minor';
              case 4: return 'Info';
              case 5: return 'Normal';
              default: return 'Unknown';
          }
          }
        * 
       */
      sensor_data = parseFloat(dto.value_data) || 0;
      const sensorValue = sensor_data; // ใช้ sensor_data เป็น sensorValue
      if (max != '' && sensorValue > max) {
        alarmStatusSet = 1;
        title = 'Warning Highest value';
        subject = `${mqttName} Warning Highest value: ${deviceName} data : ${sensorValue} ${unit}`;
        content = `${mqttName} ${alarmActionName} Warning Highest value Device : ${deviceName} data :${sensorValue}`;
        dataAlarm = statusWarning;
        data_alarm = statusWarning;
        status = 1;
      } else if (min != '' && sensorValue < min) {
        alarmStatusSet = 1;
        title = 'Warning Minimum value';
        subject = `${mqttName} Warning Minimum value: ${deviceName} data : ${sensorValue} ${unit}`;
        content = `${mqttName} ${alarmActionName} Warning Minimum value Device : ${deviceName} data :${sensorValue}`;
        dataAlarm = statusWarning;
        data_alarm = statusWarning;
        status = 1;
      } else if (
        (sensorValue > statusWarning || sensorValue === statusWarning) &&
        statusWarning < statusAlert
      ) {
        alarmStatusSet = 1;
        title = 'Warning';
        subject = `${mqttName} Warning : ${deviceName} data : ${sensorValue} ${unit}`;
        content = `${mqttName} ${alarmActionName} Warning Device : ${deviceName} data :${sensorValue}`;
        dataAlarm = statusWarning;
        data_alarm = statusWarning;
        status = 1;
      } else if (
        (sensorValue > statusAlert || sensorValue === statusAlert) &&
        statusAlert > statusWarning
      ) {
        alarmStatusSet = 2;
        title = 'Alarm';
        subject = `${mqttName} Critical Alarm : ${deviceName} data :${sensorValue} ${unit}`;
        content = `${mqttName} ${alarmActionName} Alarm Alarm Device : ${deviceName} data :${sensorValue}`;
        dataAlarm = statusAlert;
        data_alarm = statusAlert; // แก้ไขจาก recoveryWarning เป็น statusAlert
        status = 2;
      } else if (
        count_alarm >= 1 &&
        (sensorValue < recoveryWarning || sensorValue === recoveryWarning) &&
        recoveryWarning <= recoveryAlert
      ) {
        alarmStatusSet = 3;
        title = 'Recovery Warning ';
        subject = `${mqttName} Recovery Warning : ${deviceName} data :${sensorValue} ${unit}`;
        content = `${mqttName} ${alarmActionName} Recovery Warning Device : ${deviceName} data :${sensorValue}`;
        dataAlarm = recoveryWarning;
        data_alarm = recoveryWarning;
        eventControl = event === 1 ? 0 : 1;
        messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
        status = 3;
      } else if (
        count_alarm >= 1 &&
        (sensorValue < recoveryAlert || sensorValue === recoveryAlert) &&
        recoveryAlert >= recoveryWarning
      ) {
        alarmStatusSet = 4;
        title = `${mqttName} Recovery Critical Alarm`;
        subject = `${mqttName} Recovery Critical Alarm :${deviceName} data :${sensorValue} ${unit}`;
        content = `${mqttName} ${alarmActionName} Recovery Alarm Alarm Device : ${deviceName} data :${sensorValue}`;
        dataAlarm = recoveryAlert;
        data_alarm = recoveryAlert;
        eventControl = event === 1 ? 0 : 1;
        messageMqttControl = event === 1 ? mqttControlOff : mqttControlOn;
        status = 4;
      } else {
        alarmStatusSet = 999;
        title = 'Normal';
        subject = 'Normal';
        content = 'Normal Status ';
        dataAlarm = 0;
        data_alarm = 0;
        status = 5;
      }

      // 6. สร้าง object ผลลัพธ์
      const result = {
        status: status,
        statusControl: status,
        alarmTypeId: type_id,
        type_id: type_id,
        alarmStatusSet: alarmStatusSet,
        title,
        subject: subject,
        content: content,
        value_data: value_data,
        value_alarm: dto.value_alarm || '',
        value_relay: value_relay,
        value_control_relay: value_control_relay,
        dataAlarm: dataAlarm,
        data_alarm: data_alarm,
        max: max,
        min: min,
        eventControl: eventControl,
        messageMqttControl: messageMqttControl,
        sensor_data: sensor_data,
        count_alarm: count_alarm,
        mqttName: mqttName,
        mqtt_name: dto.mqtt_name || '',
        device_name: dto.device_name || '',
        mqtt_control_on: dto.mqtt_control_on || '',
        unit: dto.unit || '',
        sensorValue: dto.sensorValueData || '',
        statusAlert: statusAlert,
        statusWarning: statusWarning,
        recoveryWarning: recoveryWarning,
        recoveryAlert: dto.recovery_alert || '',
        deviceName: dto.device_name || '',
        alarmActionName: dto.action_name || '',
        mqttControlOn: dto.mqtt_control_on || '',
        mqttControlOff: dto.mqtt_control_off || '',
        event: dto.event || 0,
        //dto: dto
      };
      return result;
    } catch (error) {
      console.error('Error in getAlarmDetails:', error);
      throw error;
    }
  }
ต้องการร้าง ชุดสำส่ง สำหรับ ติดตั้ง applicatin on ubuntu โดยมีรายละเอียดดังนี้
docker.sh
1.install pythom
2.install nodejs v 22.20.0
3.install docker 
4.install docker-compose 

TCP 	52169 	52169 	52169 	52169 	192.168.1.50 	database 	
TCP 	52160 	52160 	52160 	52160 	192.168.1.50 	SecureWebServerHTTPS 	
TCP 	52161 	52161 	52161 	52161 	192.168.1.50 	api 	
TCP/UDP 	52162 	52162 	52162 	52162 	192.168.1.50 	nedered 	
TCP 	52163 	52163 	52163 	52163 	192.168.1.50 	gafana 	
TCP/UDP 	52164 	52164 	52164 	52164 	192.168.1.50 	influxdb 	
TCP 	52165 	52165 	52165 	52165 	192.168.1.50 	mqtt 	
TCP 	52166 	52166 	52166 	52166 	192.168.1.50 	n8n 	
TCP 	52167 	52167 	52167 	52167 	192.168.1.50 	junkins 	
TCP 	52168 	52168 	52168 	52168 	192.168.1.50 	redis 

```