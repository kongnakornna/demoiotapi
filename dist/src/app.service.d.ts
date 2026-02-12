import { Repository } from 'typeorm';
import { User } from '@src/modules/users/entities/user.entity';
export declare class AppService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    getHello(): string;
    getHi(): string;
    checkHealthStatus(): Promise<boolean>;
}
