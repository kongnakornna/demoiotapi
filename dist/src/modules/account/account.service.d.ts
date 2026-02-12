import { CreateAccountDto } from '@src/modules/account/dto/create-account.dto';
import { UpdateAccountDto } from '@src/modules/account/dto/update-account.dto';
export declare class AccountService {
    create(createAccountDto: CreateAccountDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateAccountDto: UpdateAccountDto): string;
    remove(id: number): string;
}
