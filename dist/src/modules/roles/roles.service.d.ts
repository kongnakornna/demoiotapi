import { Repository } from 'typeorm';
import { Role } from '@src/modules/roles/entities/role.entity';
import { Rolesaccess } from '@src/modules/roles/entities/rolesaccess.entity';
import 'dotenv/config';
export declare class RolesService {
    private RoleRepository;
    private RolesaccessRepository;
    private readonly logger;
    constructor(RoleRepository: Repository<Role>, RolesaccessRepository: Repository<Rolesaccess>);
    getlist(): Promise<Role>;
    getData(role_type_id: number): Promise<Role>;
    deleteData(role_type_id: number): Promise<void>;
    createData(dto: any): Promise<Role>;
    updateData(dto: any): Promise<any>;
}
