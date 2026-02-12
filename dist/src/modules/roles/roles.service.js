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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const users_service_1 = require("../users/users.service");
const role_entity_1 = require("./entities/role.entity");
const rolesaccess_entity_1 = require("./entities/rolesaccess.entity");
require("dotenv/config");
require('dotenv').config();
let RolesService = class RolesService {
    constructor(RoleRepository, RolesaccessRepository) {
        this.RoleRepository = RoleRepository;
        this.RolesaccessRepository = RolesaccessRepository;
        this.logger = new common_1.Logger(users_service_1.UsersService.name);
    }
    async getlist() {
        console.log(`getlist urole_type_id=`);
        try {
            const query = await this.RoleRepository.createQueryBuilder('r');
            query.select(['r.*']);
            query.where('1=1');
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
    async getData(role_type_id) {
        try {
            const rs = await this.RoleRepository.findOne({
                where: {
                    role_type_id,
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
    async deleteData(role_type_id) {
        try {
            this.logger.log(`Deleting Role with role_type_id: ${role_type_id}`);
            const Role = await this.getData(role_type_id);
            if (!Role) {
                throw new common_1.NotFoundException(`Role with role_type_id ${role_type_id} not found`);
            }
            await this.RoleRepository.delete(role_type_id);
        }
        catch (error) {
            this.logger.error(`Error while deleting Role = ${error}`);
            throw new common_1.UnprocessableEntityException({
                status: common_1.HttpStatus.UNPROCESSABLE_ENTITY,
                error: {
                    errorMessage: error.message,
                },
            });
        }
    }
    async createData(dto) {
        const result = await this.RoleRepository.save(this.RoleRepository.create(dto));
        return result;
    }
    async updateData(dto) {
        let role_type_id = dto.role_type_id;
        const DataUpdate = {};
        const query = await this.RoleRepository.createQueryBuilder('r');
        query.select(['r.role_type_id AS urole_type_id', 'r.role_role_type_id AS rolerole_type_id']);
        query.where('1=1');
        query.andWhere('r.role_type_id=:role_type_id', { role_type_id: role_type_id });
        query.printSql();
        query.maxExecutionTime(10000);
        query.getSql();
        let count = await query.getCount();
        let dataRs = await query.getRawMany();
        if (!dataRs) {
            throw new common_1.NotFoundException(`Data with role_type_id ${role_type_id} not found`);
            var result = {
                statusCode: 200,
                code: 422,
                message: `Data not found Userrole_type_id ${role_type_id}.`,
                message_th: `ไม่พบข้อมูล Userrole_type_id ${role_type_id}.`,
                payload: null,
            };
            return result;
        }
        else {
        }
        if (dto.name) {
            DataUpdate.name = dto.name;
        }
        if (dto.detail) {
            DataUpdate.detail = dto.detail;
        }
        if (dto.created) {
            DataUpdate.created = dto.created;
        }
        if (dto.updated) {
            DataUpdate.updated = dto.updated;
        }
        if (dto.insert) {
            DataUpdate.insert = dto.insert;
        }
        if (dto.update) {
            DataUpdate.update = dto.update;
        }
        if (dto.delete) {
            DataUpdate.delete = dto.delete;
        }
        if (dto.select) {
            DataUpdate.select = dto.select;
        }
        if (dto.log) {
            DataUpdate.log = dto.log;
        }
        if (dto.config) {
            DataUpdate.config = dto.config;
        }
        if (dto.truncate) {
            DataUpdate.truncate = dto.truncate;
        }
        console.log('update DataUpdate');
        console.info(DataUpdate);
        await this.RoleRepository
            .createQueryBuilder()
            .update(role_entity_1.Role)
            .set(DataUpdate)
            .where('role_type_id=:role_type_id', { role_type_id: role_type_id })
            .execute();
        return 200;
    }
};
RolesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    __param(1, (0, typeorm_1.InjectRepository)(rolesaccess_entity_1.Rolesaccess)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], RolesService);
exports.RolesService = RolesService;
//# sourceMappingURL=roles.service.js.map