"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const sduserrole_entity_1 = require("./entities/sduserrole.entity");
const file_entity_1 = require("./entities/file.entity");
const rolesaccess_entity_1 = require("./entities/rolesaccess.entity");
const userrolepermission_entity_1 = require("./entities/userrolepermission.entity");
const format_helper_1 = require("../../helpers/format.helper");
var moment = require('moment');
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let UsersService = UsersService_1 = class UsersService {
    constructor(userRepository, userroleRepository, userfileRepository, aduserRolesAccessRepository, userRolePermissionRepository) {
        this.userRepository = userRepository;
        this.userroleRepository = userroleRepository;
        this.userfileRepository = userfileRepository;
        this.aduserRolesAccessRepository = aduserRolesAccessRepository;
        this.userRolePermissionRepository = userRolePermissionRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async paginate(options) {
        const queryBuilder = this.userRepository.createQueryBuilder('u');
        queryBuilder.orderBy('u.createddate', 'DESC');
        return (0, nestjs_typeorm_paginate_1.paginate)(queryBuilder, options);
    }
    async useractive(dto) {
        console.log(`dto=`);
        console.info(dto);
        try {
            const isCount = 0;
            const active_status = 1;
            var status = '1';
            const query = await this.userRepository.createQueryBuilder('u');
            if (isCount == 1) {
                var countRs = await query.getCount(['u.id AS uid']);
            }
            else {
                query.select(['u.*']);
            }
            query.where('1=1');
            if (active_status) {
                query.andWhere('u.active_status=:active_status', {
                    active_status: active_status,
                });
                query.andWhere('u.status IN(:...status)', { status: [1] });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCounts.count =>` + tempCounts.count);
                return count;
            }
            else {
                query.orderBy(`u.createddate`, 'ASC');
                var rs = await query.getRawMany();
                console.log(`rs =>` + rs);
                return rs;
            }
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async useractiveemail(dto) {
        console.log(`dto=`);
        console.info(dto);
        try {
            const isCount = 0;
            const active_status = 1;
            var status = '1';
            const query = await this.userRepository.createQueryBuilder('u');
            if (isCount == 1) {
                var countRs = await query.getCount(['u.id AS uid']);
            }
            else {
                query.select(['u.role_id as role_id',
                    'u.email as email',
                    'u.username as username',
                    'u.public_notification as public_notification',
                    'u.sms_notification as sms_notification',
                    'u.email_notification as email_notification',
                    'u.line_notification as line_notification',
                    'u.mobile_number as mobile_number',
                    'u.phone_number as phone_number',
                    'u.lineid as lineid']);
            }
            query.where('1=1');
            query.andWhere('u.email_notification=:email_notification', {
                email_notification: active_status,
            });
            if (active_status) {
                query.andWhere('u.active_status=:active_status', {
                    active_status: active_status,
                });
                query.andWhere('u.status IN(:...status)', { status: [1] });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCounts.count =>` + tempCounts.count);
                return count;
            }
            else {
                query.orderBy(`u.createddate`, 'ASC');
                var rs = await query.getRawMany();
                console.log(`rs =>` + rs);
                return rs;
            }
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async useractivesms(dto) {
        console.log(`dto=`);
        console.info(dto);
        try {
            const isCount = 0;
            const active_status = 1;
            var status = '1';
            const query = await this.userRepository.createQueryBuilder('u');
            if (isCount == 1) {
                var countRs = await query.getCount(['u.id AS uid']);
            }
            else {
                query.select(['u.role_id',
                    'u.email',
                    'u.username',
                    'u.firstname',
                    'u.lastname',
                    'u.fullname',
                    'u.nickname',
                    'u.status',
                    'u.active_status',
                    'u.network_id',
                    'u.infomation_agree_status',
                    'u.online_status',
                    'u.network_type_id',
                    'u.public_status',
                    'u.type_id',
                    'u.public_notification',
                    'u.sms_notification',
                    'u.email_notification',
                    'u.line_notification',
                    'u.mobile_number',
                    'u.phone_number',
                    'u.lineid']);
            }
            query.where('1=1');
            query.andWhere('u.sms_notification=:sms_notification', {
                sms_notification: active_status,
            });
            if (active_status) {
                query.andWhere('u.active_status=:active_status', {
                    active_status: active_status,
                });
                query.andWhere('u.status IN(:...status)', { status: [1] });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCounts.count =>` + tempCounts.count);
                return count;
            }
            else {
                query.orderBy(`u.createddate`, 'ASC');
                var rs = await query.getRawMany();
                console.log(`rs =>` + rs);
                return rs;
            }
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async useractiveline(dto) {
        console.log(`dto=`);
        console.info(dto);
        try {
            const isCount = 0;
            const active_status = 1;
            var status = '1';
            const query = await this.userRepository.createQueryBuilder('u');
            if (isCount == 1) {
                var countRs = await query.getCount(['u.id AS uid']);
            }
            else {
                query.select(['u.role_id',
                    'u.email',
                    'u.username',
                    'u.firstname',
                    'u.lastname',
                    'u.fullname',
                    'u.nickname',
                    'u.status',
                    'u.active_status',
                    'u.network_id',
                    'u.infomation_agree_status',
                    'u.online_status',
                    'u.network_type_id',
                    'u.public_status',
                    'u.type_id',
                    'u.public_notification',
                    'u.sms_notification',
                    'u.email_notification',
                    'u.line_notification',
                    'u.mobile_number',
                    'u.phone_number',
                    'u.lineid']);
            }
            query.where('1=1');
            query.andWhere('u.line_notification=:line_notification', {
                line_notification: active_status,
            });
            if (active_status) {
                query.andWhere('u.active_status=:active_status', {
                    active_status: active_status,
                });
                query.andWhere('u.status IN(:...status)', { status: [1] });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCounts.count =>` + tempCounts.count);
                return count;
            }
            else {
                query.orderBy(`u.createddate`, 'ASC');
                var rs = await query.getRawMany();
                console.log(`rs =>` + rs);
                return rs;
            }
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async listpaginateAdmin(dto) {
        console.log(`getProfile dto=`);
        console.info(dto);
        try {
            var idx = dto.idx || '';
            var keyword = dto.keyword || '';
            var status = dto.status || '1';
            var active_status = dto.active_status || '0,1';
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.userRepository.createQueryBuilder('u');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT u.id)', 'cnt');
            }
            else {
                query.select([
                    'DISTINCT u.id AS uid',
                    'u.role_id AS role_id',
                    'u.email AS email',
                    'u.username AS username',
                    'u.firstname AS firstname',
                    'u.lastname AS lastname',
                    'u.fullname AS fullname',
                    'u.nickname AS nickname',
                    'u.idcard AS idcard',
                    'u.lastsignindate AS lastsignindate',
                    'u.status AS status',
                    'u.active_status AS active_status',
                    'u.network_id AS network_id',
                    'u.remark AS remark',
                    'u.infomation_agree_status AS infomation_agree_status',
                    'u.gender AS gender',
                    'u.birthday AS birthday',
                    'u.online_status AS online_status',
                    'u.message AS message',
                    'u.network_type_id AS network_type_id',
                    'u.public_status AS public_status',
                    'u.type_id AS type_id',
                    'u.avatarpath AS avatarpath',
                    'u.avatar AS avatar',
                    'u.loginfailed AS loginFailed',
                    'u.createddate AS createddate',
                    'u.updateddate AS updateddate',
                    'u.deletedate AS deletedate',
                    'u.mobile_number AS mobile_number',
                    'u.lineid AS lineid',
                    'u.loginfailed AS loginfailed',
                    'u.public_notification AS public_notification',
                    'u.sms_notification AS sms_notification',
                    'u.email_notification AS email_notification',
                    'u.line_notification AS line_notification',
                    'u.mobile_number AS mobile_number',
                    'u.phone_number AS phone_number',
                    'role.title AS rolename',
                    'access.role_type_id AS role_type_id',
                    'permision.name  AS permision_name',
                    'permision.detail  AS permision_detail',
                    'permision.created  AS permision_created',
                    'permision.updated  AS permision_updated',
                    'permision.insert  AS permision_insert',
                    'permision.update  AS permision_update',
                    'permision.delete  AS permision_delete',
                    'permision.select  AS permision_select',
                    'permision.log  AS permision_log',
                    'permision.config  AS permision_config',
                    'permision.truncate  AS permision_truncate',
                ]);
            }
            query.innerJoin("sd_user_role", "role", "u.role_id = role.role_id");
            query.innerJoin("sd_user_roles_access", "access", "role.role_id = access.role_type_id");
            query.innerJoin("sd_user_roles_permision", "permision", "access.role_type_id = permision.role_type_id");
            query.where('1=1');
            if (keyword) {
                query.andWhere('u.username like :username', {
                    username: keyword ? `%${keyword}%` : '%',
                });
            }
            if (idx) {
                query.andWhere('u.id=:id', { id: idx });
            }
            if (status) {
                query.andWhere("u.status IN(:...status)", { status: [1] });
                const statusArray = status.split(',').map(Number);
                query.andWhere('u.status IN(:...status)', { status: statusArray });
            }
            if (active_status) {
                const statusArray = active_status.split(',').map(Number);
                query.andWhere('u.active_status IN(:...active_status)', {
                    active_status: statusArray,
                });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCounts.count =>` + tempCounts.count);
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult === false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    console.log(`sort=`);
                    console.info(sort);
                    console.log(`sortField=` + sortField);
                    console.log(`sortOrder=` + sortOrder);
                    console.log(`sortResult=`);
                    console.info(sortResult);
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`u.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`u.createddate`, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async listpaginate(dto) {
        console.log(`getProfile dto=`);
        console.info(dto);
        try {
            var idx = dto.idx || '';
            var keyword = dto.keyword || '';
            var status = dto.status || '1';
            var active_status = dto.active_status || '0,1';
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.userRepository.createQueryBuilder('u');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT u.id)', 'cnt');
            }
            else {
                query.select([
                    'u.id AS uid',
                    'u.role_id AS role_id',
                    'u.email AS email',
                    'u.username AS username',
                    'u.firstname AS firstname',
                    'u.lastname AS lastname',
                    'u.fullname AS fullname',
                    'u.nickname AS nickname',
                    'u.idcard AS idcard',
                    'u.lastsignindate AS lastsignindate',
                    'u.status AS status',
                    'u.active_status AS active_status',
                    'u.network_id AS network_id',
                    'u.remark AS remark',
                    'u.infomation_agree_status AS infomation_agree_status',
                    'u.gender AS gender',
                    'u.birthday AS birthday',
                    'u.online_status AS online_status',
                    'u.message AS message',
                    'u.network_type_id AS network_type_id',
                    'u.public_status AS public_status',
                    'u.type_id AS type_id',
                    'u.avatarpath AS avatarpath',
                    'u.avatar AS avatar',
                    'u.loginfailed AS loginFailed',
                    'u.createddate AS createddate',
                    'u.updateddate AS updateddate',
                    'u.deletedate AS deletedate',
                ]);
            }
            query.where('1=1');
            if (keyword) {
                query.andWhere('u.username like :username', {
                    username: keyword ? `%${keyword}%` : '%',
                });
            }
            if (idx) {
                query.andWhere('u.id=:id', { id: idx });
            }
            if (status) {
                const statusArray = status.split(',').map(Number);
                query.andWhere('u.status IN(:...status)', { status: statusArray });
            }
            if (active_status) {
                const statusArray = active_status.split(',').map(Number);
                query.andWhere('u.active_status IN(:...active_status)', {
                    active_status: statusArray,
                });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCounts.count =>` + tempCounts.count);
                return count;
            }
            else {
                if (sort) {
                    const sortResult = (0, format_helper_1.convertSortInput)(sort);
                    if (sortResult === false) {
                        throw new common_1.BadRequestException(`Invalid sort option.`);
                    }
                    const { sortField, sortOrder } = sortResult;
                    console.log(`sort=`);
                    console.info(sort);
                    console.log(`sortField=` + sortField);
                    console.log(`sortOrder=` + sortOrder);
                    console.log(`sortResult=`);
                    console.info(sortResult);
                    if (sortOrder == 'ASC' || sortOrder == 'asc') {
                        var sortOrders = 'ASC';
                    }
                    else if (sortOrder == 'DESC' || sortOrder == 'desc') {
                        var sortOrders = 'DESC';
                    }
                    else {
                        var sortOrders = 'ASC';
                    }
                    query.orderBy(`u.${sortField}`, sortOrders.toUpperCase());
                }
                else {
                    query.orderBy(`u.createddate`, 'ASC');
                }
                query.limit(pageSize);
                query.offset(pageSize * (page - 1));
                return await query.getRawMany();
            }
        }
        catch (error) {
            var error1 = JSON.stringify(error);
            var error2 = JSON.parse(error1);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: error2 },
                },
            });
        }
    }
    async useractivetelegram(dto) {
        console.log(`dto=`);
        console.info(dto);
        try {
            const isCount = 0;
            const active_status = 1;
            var status = '1';
            const query = await this.userRepository.createQueryBuilder('u');
            if (isCount == 1) {
                var countRs = await query.getCount(['u.id AS uid']);
            }
            else {
                query.select(['u.role_id',
                    'u.email',
                    'u.username',
                    'u.firstname',
                    'u.lastname',
                    'u.fullname',
                    'u.nickname',
                    'u.status',
                    'u.active_status',
                    'u.network_id',
                    'u.infomation_agree_status',
                    'u.online_status',
                    'u.network_type_id',
                    'u.public_status',
                    'u.type_id',
                    'u.public_notification',
                    'u.sms_notification',
                    'u.email_notification',
                    'u.line_notification',
                    'u.mobile_number',
                    'u.phone_number',
                    'u.lineid']);
            }
            query.where('1=1');
            query.andWhere('u.sms_notification=:sms_notification', {
                sms_notification: active_status,
            });
            if (active_status) {
                query.andWhere('u.active_status=:active_status', {
                    active_status: active_status,
                });
                query.andWhere('u.status IN(:...status)', { status: [1] });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCounts.count =>` + tempCounts.count);
                return count;
            }
            else {
                query.orderBy(`u.createddate`, 'ASC');
                var rs = await query.getRawMany();
                console.log(`rs =>` + rs);
                return rs;
            }
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async getHash(password) {
        return await bcrypt.hash(password, 10);
    }
    async createsystem(user) {
        const password_chk = user.password;
        const userToCreate = Object.assign(Object.assign({}, user), { password: await this.getHash(user.password), password_temp: user.password, message: 'system', infomation_agree_status: 0 });
        const result = await this.userRepository.save(this.userRepository.create(userToCreate));
        return result;
    }
    async create(user) {
        const password_chk = user.password;
        const userToCreate = Object.assign(Object.assign({}, user), { password: await this.getHash(user.password), password_temp: user.password, message: 'Register', infomation_agree_status: 0, status: 1, active_status: 1 });
        const result = await this.userRepository.save(this.userRepository.create(userToCreate));
        return result;
    }
    async findByEmail(email) {
        try {
            const result = await this.userRepository.findOne({
                where: { email },
            });
            return result;
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async finduserId(id) {
        try {
            const result = await this.userRepository.findOne({
                where: { id },
            });
            return result;
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async getUserGuard(id) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id,
                },
            });
            const payload = {
                id: user.id,
                username: user.username,
                email: user.email,
                refresh_token: user.refresh_token,
            };
            const RefreshTokenChk = payload.refresh_token;
            if (RefreshTokenChk == null) {
                var rt = 0;
            }
            else {
                var rt = 1;
            }
            return await rt;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async getUser(id) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id,
                },
            });
            return user;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async getMeUser(id) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    id,
                },
            });
            return user;
        }
        catch (err) {
            this.logger.error(`Error on getMeUser ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async checkUserActive(idx) {
        console.log(`checkUserActive idx=`);
        console.info(idx);
        try {
            const isCount = 1;
            const active_status = 1;
            var status = '1,88,99';
            const query = await this.userRepository.createQueryBuilder('u');
            if (isCount == 1) {
                var countRs = await query.getCount(['u.id AS uid']);
            }
            else {
                query.select(['u.id AS uid']);
            }
            query.where('1=1');
            if (idx) {
                query.andWhere('u.id=:id', { id: idx });
            }
            if (active_status) {
                query.andWhere('u.active_status=:active_status', {
                    active_status: active_status,
                });
                query.andWhere('u.status IN(:...status)', { status: [1, 88, 99] });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (isCount == 1) {
                var count = await query.getCount();
                let tempCounts = {};
                tempCounts.count = countRs;
                console.log(`count =>` + count);
                console.log(`tempCounts.count =>` + tempCounts.count);
                return count;
            }
            else {
                query.orderBy(`u.createddate`, 'ASC');
                var rs = await query.getRawMany();
                console.log(`rs =>` + rs);
                return rs;
            }
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async getProfile(idx) {
        console.log(`getProfile idx=`);
        console.info(idx);
        try {
            const query = await this.userRepository.createQueryBuilder('u');
            query.select([
                'u.id AS uid',
                'u.role_id AS roleid',
                'u.email AS email',
                'u.username AS username',
                'u.firstname AS firstname',
                'u.lastname AS lastname',
                'u.fullname AS fullname',
                'u.nickname AS nickname',
                'u.idcard AS idcard',
                'u.lastsignindate AS lastsignindate',
                'u.status AS status',
                'u.active_status AS active_status',
                'u.network_id AS network_id',
                'u.remark AS remark',
                'u.infomation_agree_status AS infomation_agree_status',
                'u.gender AS gender',
                'u.birthday AS birthday',
                'u.online_status AS online_status',
                'u.message AS message',
                'u.network_type_id AS network_type_id',
                'u.public_status AS public_status',
                'u.type_id AS type_id',
                'u.avatarpath AS avatarpath',
                'u.avatar AS avatar',
                'u.loginfailed AS loginFailed',
                'u.refresh_token AS refresh_token',
                'u.createddate AS createddate',
                'u.updateddate AS updateddate',
                'u.deletedate AS deletedate',
                'u.public_notification AS public_notification',
                'u.sms_notification AS sms_notification',
                'u.email_notification AS email_notification',
                'u.line_notification AS line_notification',
                'u.lineid AS lineid',
                'u.mobile_number AS mobile_number',
                'u.phone_number AS phone_number',
                'role.title AS rolename',
                'access.role_type_id AS role_type_id',
                'permision.name  AS permision_name',
                'permision.detail  AS permision_detail',
                'permision.created  AS permision_created',
                'permision.updated  AS permision_updated',
                'permision.insert  AS permision_insert',
                'permision.update  AS permision_update',
                'permision.delete  AS permision_delete',
                'permision.select  AS permision_select',
                'permision.log  AS permision_log',
                'permision.config  AS permision_config',
                'permision.truncate  AS permision_truncate',
            ]);
            query.innerJoin("sd_user_role", "role", "u.role_id = role.role_id");
            query.leftJoin("sd_user_roles_access", "access", "role.role_id = access.role_type_id");
            query.leftJoin("sd_user_roles_permision", "permision", "access.role_type_id = permision.role_type_id");
            query.where('1=1');
            query.andWhere('u.id=:id', { id: idx });
            query.andWhere('u.status IN(:...status)', { status: [1, 88, 99] });
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            let rs = await query.getRawMany();
            return rs;
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async chkProfile(uid) {
        console.log(`chkProfile uid=`);
        console.info(uid);
        try {
            const query = await this.userRepository.createQueryBuilder('u');
            query.select(['u.id AS uid']);
            query.where('1=1');
            query.andWhere('u.id=:id', { id: uid });
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            let rs = await query.getRawMany();
            console.info(query);
            console.log(`rs=`);
            console.info(rs);
            return rs;
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async getTokenUser(refresh_token) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    refresh_token,
                },
            });
            let idx = user.id;
            return idx;
        }
        catch (err) {
            this.logger.error(`Error on getMeUser ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    message: 'Token Invalid! Or Token Expired..',
                },
            });
        }
    }
    async getUserByusername(username) {
        try {
            const query = await this.userRepository.createQueryBuilder('u');
            query.select([
                'u.id AS uid',
                'u.role_id AS roleid',
                'u.email AS email',
                'u.username AS username',
                'u.firstname AS firstname',
                'u.lastname AS lastname',
                'u.fullname AS fullname',
                'u.nickname AS nickname',
                'u.idcard AS idcard',
                'u.lastsignindate AS lastsignindate',
                'u.status AS status',
                'u.active_status AS active_status',
                'u.network_id AS network_id',
                'u.remark AS remark',
                'u.infomation_agree_status AS infomation_agree_status',
                'u.gender AS gender',
                'u.birthday AS birthday',
                'u.online_status AS online_status',
                'u.message AS message',
                'u.network_type_id AS network_type_id',
                'u.public_status AS public_status',
                'u.type_id AS type_id',
                'u.avatarpath AS avatarpath',
                'u.avatar AS avatar',
                'u.refresh_token AS refresh_token',
                'u.createddate AS createddate',
                'u.updateddate AS updateddate',
                'u.deletedate AS deletedate',
                'u.loginfailed AS loginfailed',
            ]);
            query.where('1=1');
            query.andWhere('u.username=:username', { username: username });
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            let count = await query.getCount();
            console.log(`count=`);
            console.info(count);
            let rs = await query.getRawMany();
            console.log(`rs=`);
            console.info(rs);
            if (count != 0) {
                return rs;
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    args: { errorMessage: JSON.stringify(error) },
                },
            });
        }
    }
    async getUserByusernameauth(username) {
        const user = await this.userRepository.findOne({
            where: {
                username,
            },
        });
        if (user) {
            return user;
        }
        else {
            return user;
        }
    }
    async getUserByEmail(email) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });
        if (user) {
            return user;
        }
        else {
            return user;
        }
    }
    async createUser(userBody) {
        try {
            let user = null;
            return user;
        }
        catch (err) {
            this.logger.error(`Error ${JSON.stringify(err)}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: err.message,
                },
            });
        }
    }
    async deleteUser(userId) {
        try {
            this.logger.log(`Deleting user with Id: ${userId}`);
            const user = await this.getUser(userId);
            if (!user) {
                throw new common_1.NotFoundException(`User with id ${userId} not found`);
            }
            await this.userRepository.delete(userId);
        }
        catch (error) {
            this.logger.error(`Error while deleting user = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async compareHash(password, hash) {
        return await bcrypt.compare(password, hash);
    }
    async updaterefreshtoken(userId, refresh_token) {
        return await this.userRepository.update({ id: userId }, { refresh_token });
    }
    async updatereloginfailed(userId, loginfailed) {
        return await this.userRepository.update({ id: userId }, { loginfailed });
    }
    async update_user_status(uid, active_status) {
        console.log(`Updating devices with uid '${uid}' to active_status ${active_status}`);
        try {
            const updateResult = await this.userRepository.update({ id: uid }, { active_status: active_status });
            if (updateResult.affected === 0) {
                this.logger.warn(`No devices found for uid '${uid}'. Update failed.`);
                throw new common_1.NotFoundException(`No devices found with bucket '${uid}'`);
            }
            this.logger.log(`${updateResult.affected} device(s) updated successfully for uid '${uid}'.`);
            return updateResult.affected;
        }
        catch (err) {
            if (err instanceof common_1.NotFoundException) {
                throw err;
            }
            this.logger.error(`Failed to update device status for mqtt_id '${uid}'. Error: ${err.message}`, err.stack);
            throw new common_1.UnprocessableEntityException('An unexpected error occurred while updating device status.');
        }
    }
    async createNewSdUser(user) {
        const password_chk = user.password;
        const userToCreate = Object.assign(Object.assign({}, user), { password: await this.getHash(user.password), password_temp: user.password, message: 'Register', infomation_agree_status: 0 });
        const result = await this.userRepository.save(this.userRepository.create(userToCreate));
        return result;
    }
    async updateSdUser(dto) {
        let idx = dto.id;
        const DataUpdate = {};
        const query = await this.userRepository.createQueryBuilder('u');
        query.select(['u.id AS uid', 'u.role_id AS roleid']);
        query.where('1=1');
        query.andWhere('u.id=:id', { id: idx });
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        let count = await query.getCount();
        let dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with ID ${idx} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found UserID ${idx}.`,
                message_th: `ไม่พบข้อมูล UserID ${idx}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.role_id) {
            DataUpdate.role_id = dto.role_id;
        }
        if (dto.email) {
            DataUpdate.email = dto.email;
        }
        if (dto.username) {
            DataUpdate.username = dto.username;
        }
        if (dto.password) {
            DataUpdate.password = await this.getHash(dto.password);
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
            DataUpdate.lastsignindate = dto.lastsignindate;
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
        if (dto.updateddate) {
        }
        const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';
        const updateddate = moment(new Date(), DATE_TIME_FORMAT);
        DataUpdate.updateddate = Date();
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
        if (dto.line_notification) {
            DataUpdate.line_notification = dto.line_notification;
        }
        if (dto.lineid) {
            DataUpdate.lineid = dto.lineid;
        }
        if (dto.mobile_number) {
            DataUpdate.mobile_number = dto.mobile_number;
        }
        if (dto.phone_number) {
            DataUpdate.phone_number = dto.phone_number;
        }
        console.log('update DataUpdate');
        console.info(DataUpdate);
        await this.userRepository
            .createQueryBuilder()
            .update(user_entity_1.User)
            .set(DataUpdate)
            .where('id=:id', { id: idx })
            .execute();
        return 200;
    }
    async resetPassword(dto) {
        let idx = dto.id;
        const DataUpdate = {};
        const dataRs = await this.userRepository.findOne({
            where: { id: idx },
        });
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with ID ${idx} not found`);
        }
        if (dto.password) {
            DataUpdate.password = await this.getHash(dto.password);
        }
        if (dto.password) {
            DataUpdate.password_temp = dto.password;
        }
        await this.userRepository
            .createQueryBuilder()
            .update(user_entity_1.User)
            .set(DataUpdate)
            .where('id=:id', {
            id: idx,
        })
            .execute();
        return dto.id;
    }
    async logout(userId, refresh_token) {
        return await this.userRepository.update({ id: userId }, { refresh_token });
    }
    async remove(userId) {
        try {
            this.logger.log(`Deleting user with Id: ${userId}`);
            const user = await this.getUser(userId);
            if (!user) {
                throw new common_1.NotFoundException(`User with id ${userId} not found`);
            }
            await this.userRepository.delete(userId);
        }
        catch (error) {
            this.logger.error(`Error while deleting user = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
};
UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(sduserrole_entity_1.SdUserRole)),
    __param(2, (0, typeorm_1.InjectRepository)(file_entity_1.UserFile)),
    __param(3, (0, typeorm_1.InjectRepository)(rolesaccess_entity_1.SdUserRolesAccess)),
    __param(4, (0, typeorm_1.InjectRepository)(userrolepermission_entity_1.UserRolePermission)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map