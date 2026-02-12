import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY: any = 'IS_PUBLIC';
export const Public: any = () => SetMetadata(IS_PUBLIC_KEY, true);
