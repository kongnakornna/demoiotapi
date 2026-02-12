"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SyslogService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SyslogService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const devicelog_entity_1 = require("./entities/devicelog.entity");
const userlog_entity_1 = require("./entities/userlog.entity");
const userlogtype_entity_1 = require("./entities/userlogtype.entity");
const user_entity_1 = require("../users/entities/user.entity");
const rolesaccess_entity_1 = require("../users/entities/rolesaccess.entity");
const setting_entity_1 = require("../settings/entities/setting.entity");
const location_entity_1 = require("../settings/entities/location.entity");
const type_entity_1 = require("../settings/entities/type.entity");
const sensor_entity_1 = require("../settings/entities/sensor.entity");
const group_entity_1 = require("../settings/entities/group.entity");
const mqtt_entity_1 = require("../settings/entities/mqtt.entity");
const format_helper_1 = require("../../helpers/format.helper");
var moment = require('moment');
let SyslogService = SyslogService_1 = class SyslogService {
    constructor(SettingRepository, LocationRepository, TypeRepository, SensorRepository, GroupRepository, MqttRepository, DeviceLogRepository, UserLogRepository, UserLogtypeRepository, userRepository, aduserRolesAccessRepository) {
        this.SettingRepository = SettingRepository;
        this.LocationRepository = LocationRepository;
        this.TypeRepository = TypeRepository;
        this.SensorRepository = SensorRepository;
        this.GroupRepository = GroupRepository;
        this.MqttRepository = MqttRepository;
        this.DeviceLogRepository = DeviceLogRepository;
        this.UserLogRepository = UserLogRepository;
        this.UserLogtypeRepository = UserLogtypeRepository;
        this.userRepository = userRepository;
        this.aduserRolesAccessRepository = aduserRolesAccessRepository;
        this.logger = new common_1.Logger(SyslogService_1.name);
    }
    async loglistpaginate(dto) {
        console.log(`getProfile dto=`);
        console.info(dto);
        try {
            var idx = dto.idx || '';
            var uid = dto.uid || '';
            var keyword = dto.keyword || '';
            var status = dto.status;
            var select_status = dto.select_status;
            var insert_status = dto.insert_status;
            var update_status = dto.update_status;
            var delete_status = dto.delete_status;
            var log_type_id = dto.log_type_id;
            var sort = dto.sort;
            var page = dto.page || 1;
            var pageSize = dto.pageSize || 10;
            var isCount = dto.isCount || 0;
            const query = await this.UserLogRepository.createQueryBuilder('l');
            if (isCount == 1) {
                var countRs = await query.select('COUNT(DISTINCT l.id)', 'cnt');
            }
            else {
                query.select([
                    'l.id AS id',
                    'l.log_type_id AS log_type_id',
                    'l.uid AS uid',
                    'l.name AS log_name',
                    'l.detail AS detail',
                    'l.select_status AS select_status',
                    'l.insert_status AS insert_status',
                    'l.update_status AS update_status',
                    'l.delete_status AS delete_status',
                    'l.status AS status',
                    'l.create AS create',
                    'l.update AS update',
                    'l.lang AS lang',
                    'u.username AS username',
                    'u.firstname AS firstname',
                    't.type_name AS type_name',
                ]);
            }
            query.leftJoin("sd_user", "u", "l.uid = u.id");
            query.leftJoin("sd_user_log_type", "t", "l.log_type_id = t.log_type_id");
            query.where('1=1');
            if (keyword) {
                query.andWhere('l.name like :name', {
                    name: keyword ? `%${keyword}%` : '%',
                });
            }
            if (idx) {
                query.andWhere('l.id=:id', { id: idx });
            }
            if (uid) {
                query.andWhere('l.uid=:uid', { uid: uid });
            }
            if (status) {
                query.andWhere('l.status=:status', { status: status });
            }
            if (select_status) {
                query.andWhere('l.select_status=:select_status', { select_status: select_status });
            }
            if (insert_status) {
                query.andWhere('l.insert_status=:insert_status', { insert_status: insert_status });
            }
            if (update_status) {
                query.andWhere('l.update_status=:update_status', { update_status: update_status });
            }
            if (delete_status) {
                query.andWhere('l.delete_status=:delete_status', { delete_status: delete_status });
            }
            if (log_type_id) {
                query.andWhere('l.log_type_id=:log_type_id', { log_type_id: log_type_id });
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
                    query.orderBy(`l.${sortField}`, sortOrders.toLowerCase());
                }
                else {
                    query.orderBy(`l.id `, 'ASC');
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
    async getlisttype() {
        console.log(`getlisttype=`);
        try {
            const query = await this.UserLogtypeRepository.createQueryBuilder('t');
            query.select(['t.*']);
            query.where('1=1');
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            let count = await query.getCount();
            let rs = await query.getRawMany();
            console.info(query);
            console.log(`Counts=`, count);
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
    async createlog(dto) {
        const result = await this.UserLogRepository.save(this.UserLogRepository.create(dto));
        return result;
    }
    async createlogtype(dto) {
        const result = await this.UserLogtypeRepository.save(this.UserLogtypeRepository.create(dto));
        return result;
    }
    async getUserLog(id) {
        try {
            const UserLog = await this.UserLogRepository.findOne({
                where: {
                    id,
                },
            });
            return UserLog;
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
    async getlogtype(type_name) {
        try {
            const rs = await this.UserLogtypeRepository.findOne({
                where: {
                    type_name,
                },
            });
            return rs;
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
    async deleteLog(id) {
        try {
            this.logger.log(`Deleting getUserLog with Id: ${id}`);
            const user = await this.getUserLog(id);
            if (!user) {
                throw new common_1.NotFoundException(`getUserLog with id ${id} not found`);
            }
            await this.UserLogRepository.delete(id);
        }
        catch (error) {
            this.logger.error(`Error while deleting getUserLog = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async updatelogtype(dto) {
        let log_type_id = dto.log_type_id;
        const DataUpdate = {};
        const query = await this.UserLogtypeRepository.createQueryBuilder('t');
        query.select(['t.log_type_id AS log_type_id', 't.type_name AS type_name']);
        query.where('1=1');
        query.andWhere('t.log_type_id=:log_type_id', { log_type_id: log_type_id });
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        var count = await query.getCount();
        var dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with ID ${log_type_id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found UserID ${log_type_id}.`,
                message_th: `ไม่พบข้อมูล UserID ${log_type_id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.type_name) {
            DataUpdate.type_name = dto.type_name;
        }
        if (dto.type_detail) {
            DataUpdate.type_detail = dto.type_detail;
        }
        if (dto.status) {
            DataUpdate.status = dto.status;
        }
        console.log('update DataUpdate');
        console.info(DataUpdate);
        await this.UserLogtypeRepository
            .createQueryBuilder()
            .update(userlogtype_entity_1.UserLogtype)
            .set(DataUpdate)
            .where('log_type_id=:log_type_id', { log_type_id: log_type_id })
            .execute();
        return 200;
    }
};
SyslogService = SyslogService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(setting_entity_1.Setting)),
    __param(1, (0, typeorm_1.InjectRepository)(location_entity_1.Location)),
    __param(2, (0, typeorm_1.InjectRepository)(type_entity_1.Type)),
    __param(3, (0, typeorm_1.InjectRepository)(sensor_entity_1.Sensor)),
    __param(4, (0, typeorm_1.InjectRepository)(group_entity_1.Group)),
    __param(5, (0, typeorm_1.InjectRepository)(mqtt_entity_1.Mqtt)),
    __param(6, (0, typeorm_1.InjectRepository)(devicelog_entity_1.DeviceLog)),
    __param(7, (0, typeorm_1.InjectRepository)(userlog_entity_1.UserLog)),
    __param(8, (0, typeorm_1.InjectRepository)(userlogtype_entity_1.UserLogtype)),
    __param(9, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(10, (0, typeorm_1.InjectRepository)(rolesaccess_entity_1.SdUserRolesAccess)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SyslogService);
exports.SyslogService = SyslogService;
//# sourceMappingURL=syslog.service.js.map