import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@src/modules/users/users.service';
import { CreateAccessmenuDto } from '@src/modules/accessmenu/dto/create-accessmenu.dto';
import { UpdateAccessmenuDto } from '@src/modules/accessmenu/dto/update-accessmenu.dto';
import { Repository } from 'typeorm';
import { AccessMenu } from '@src/modules/accessmenu/entities/accessmenu.entity';
import { Useraccessmenu } from '@src/modules/accessmenu/entities/useraccessmenu.entity';
export declare class AccessmenuService {
    private AccessmenuRepository;
    private UseraccessmenuRepository;
    private readonly userService;
    private readonly jwtService;
    private readonly logger;
    constructor(AccessmenuRepository: Repository<AccessMenu>, UseraccessmenuRepository: Repository<Useraccessmenu>, userService: UsersService, jwtService: JwtService);
    create(createInvoiceDto: CreateAccessmenuDto): string;
    getHello(): string;
    findAll(InputData: any): Promise<AccessMenu>;
    findAllUserMunu(InputData: any): Promise<Useraccessmenu>;
    findOne(id: number): Promise<string>;
    update(id: number, updateAccessmenuDto: UpdateAccessmenuDto): Promise<string>;
    remove(id: number): Promise<string>;
}
