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
var AccessmenuService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessmenuService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
var moment = require('moment');
const accessmenu_entity_1 = require("./entities/accessmenu.entity");
const useraccessmenu_entity_1 = require("./entities/useraccessmenu.entity");
const format = __importStar(require("../../helpers/format.helper"));
let AccessmenuService = AccessmenuService_1 = class AccessmenuService {
    constructor(AccessmenuRepository, UseraccessmenuRepository, userService, jwtService) {
        this.AccessmenuRepository = AccessmenuRepository;
        this.UseraccessmenuRepository = UseraccessmenuRepository;
        this.userService = userService;
        this.jwtService = jwtService;
        this.logger = new common_1.Logger(AccessmenuService_1.name);
    }
    create(createInvoiceDto) {
        return 'This action adds a new invoice';
    }
    getHello() {
        var generatpwd = format.generatePassword(6);
        var result = {
            message: 'CmonIoT AccessmenuService!',
            generatpwd: generatpwd,
        };
        return result;
    }
    async findAll(InputData) {
        try {
            console.log(`InputData=>`);
            console.info(InputData);
            var generatpwd = format.generatePassword(6);
            const query = await this.AccessmenuRepository.createQueryBuilder('a');
            query.select([
                'a.admin_access_id AS access_id',
                'a.admin_type_id AS type_id',
                'a.admin_menu_id AS menu_id',
            ]);
            query.where('1=1');
            if (InputData.admin_type_id) {
                query.andWhere('a.admin_access_id=:admin_access_id', {
                    admin_access_id: InputData.admin_type_id,
                });
            }
            if (InputData.admin_menu_id) {
                query.andWhere('a.admin_menu_id IN(:...admin_menu_id)', {
                    admin_menu_id: [InputData.admin_menu_id],
                });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            let count = await query.getCount();
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
    async findAllUserMunu(InputData) {
        try {
            const query = await this.UseraccessmenuRepository.createQueryBuilder('a');
            query.select([
                'a.user_access_id AS access_id',
                'a.user_type_id AS type_id',
                'a.menu_id AS menu_id',
                'a.parent_id AS parent_id',
            ]);
            query.where('1=1');
            if (InputData.type_id) {
                query.andWhere('a.user_type_id=:user_type_id', {
                    user_type_id: InputData.type_id,
                });
            }
            if (InputData.menu_id) {
                query.andWhere('a.menu_id IN(:...menu_id)', {
                    menu_id: [InputData.menu_id],
                });
            }
            query.printSql();
            query.maxExecutionTime(10000);
            query.getSql();
            if (InputData.count === 1) {
                let count = await query.getCount();
                return count;
            }
            else {
                let rs = await query.getRawMany();
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
    async findOne(id) {
        try {
            return `This action returns a #${id} accessmenu`;
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
    async update(id, updateAccessmenuDto) {
        try {
            return `This action updates a #${id} accessmenu`;
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
    async remove(id) {
        try {
            return `This action removes a #${id} accessmenu`;
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
};
AccessmenuService = AccessmenuService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(accessmenu_entity_1.AccessMenu)),
    __param(1, (0, typeorm_1.InjectRepository)(useraccessmenu_entity_1.Useraccessmenu)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService,
        jwt_1.JwtService])
], AccessmenuService);
exports.AccessmenuService = AccessmenuService;
//# sourceMappingURL=accessmenu.service.js.map