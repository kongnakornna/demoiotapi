import { Injectable, Logger } from '@nestjs/common';
console.log(
  '--------------------------:SharedService:--------------------------',
);
@Injectable()
export class SharedService {
  getIndex(): string {
    return 'Hello SharedService!';
  }
}
