import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => this.transformToCamelCase(data))
    );
  }

  private transformToCamelCase(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.transformToCamelCase(item));
    } else if (obj !== null && obj !== undefined && typeof obj === 'object') {
      return Object.keys(obj).reduce((result, key) => {
        const camelKey = this.toCamelCase(key);
        result[camelKey] = this.transformToCamelCase(obj[key]);
        return result;
      }, {});
    }
    return obj;
  }

  private toCamelCase(str: string): string {
    // Optimized camelCase conversion - prevent recursion
    return str.replace(/([-_][a-z])/gi, (group) => 
      group.toUpperCase().replace('-', '').replace('_', '')
    );
  }
}