#!/bin/bash
# quick-fix-all.sh

# 1. Create pagination util
cat > src/common/utils/pagination.util.ts << 'EOF'
import {
  IExtendedPaginationMeta,
  IPaginationMeta,
  IPaginationLinks,
  PaginatedResponse,
  ExtendedPaginatedResponse,
} from '../interfaces/paginated-response.interface';

export class PaginationUtil {
  static calculatePagination(page: number, limit: number, total: number): IPaginationMeta {
    const totalPages = Math.ceil(total / limit);
    
    return {
      total,
      page,
      limit,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    };
  }

  static calculateExtendedPagination(
    page: number,
    limit: number,
    total: number,
  ): IExtendedPaginationMeta {
    const baseMeta = this.calculatePagination(page, limit, total);
    const skip = (page - 1) * limit;
    
    return {
      ...baseMeta,
      itemCount: Math.min(limit, total - skip),
      from: total > 0 ? skip + 1 : 0,
      to: Math.min(skip + limit, total),
    };
  }

  static createPaginationLinks(
    baseUrl: string,
    page: number,
    limit: number,
    totalPages: number,
    queryParams?: Record<string, any>,
  ): IPaginationLinks {
    const links: IPaginationLinks = {};
    const queryString = this.buildQueryString({ limit, ...queryParams });

    if (page > 1) {
      links.first = \`\${baseUrl}?page=1\${queryString}\`;
      links.previous = \`\${baseUrl}?page=\${page - 1}\${queryString}\`;
    }

    if (page < totalPages) {
      links.next = \`\${baseUrl}?page=\${page + 1}\${queryString}\`;
      links.last = \`\${baseUrl}?page=\${totalPages}\${queryString}\`;
    }

    return links;
  }

  static createPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    baseUrl?: string,
    queryParams?: Record<string, any>,
  ): PaginatedResponse<T> {
    const meta = this.calculatePagination(page, limit, total);
    let links: IPaginationLinks | undefined;

    if (baseUrl) {
      links = this.createPaginationLinks(baseUrl, page, limit, meta.totalPages, queryParams);
    }

    return new PaginatedResponse(data, meta, links);
  }

  static createExtendedPaginatedResponse<T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
    filters?: Record<string, any>,
    sort?: { by: string; order: 'ASC' | 'DESC' },
    baseUrl?: string,
    queryParams?: Record<string, any>,
  ): ExtendedPaginatedResponse<T> {
    const meta = this.calculateExtendedPagination(page, limit, total);
    let links: IPaginationLinks | undefined;

    if (baseUrl) {
      links = this.createPaginationLinks(baseUrl, page, limit, meta.totalPages, queryParams);
    }

    return new ExtendedPaginatedResponse(data, meta, links, filters, sort);
  }

  static buildQueryString(params: Record<string, any>): string {
    const query = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => query.append(\`\${key}[]\`, v.toString()));
        } else {
          query.append(key, value.toString());
        }
      }
    });

    const queryString = query.toString();
    return queryString ? \`&\${queryString}\` : '';
  }

  static getPaginationOptions(
    page: number = 1,
    limit: number = 20,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): { skip: number; take: number; order?: Record<string, 'ASC' | 'DESC'> } {
    const skip = (page - 1) * limit;
    const take = limit;
    const order = sortBy ? { [sortBy]: sortOrder } : undefined;

    return { skip, take, order };
  }

  static parsePaginationQuery(query: any): {
    page: number;
    limit: number;
    skip: number;
    sort?: Record<string, 1 | -1>;
  } {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;
    
    let sort: Record<string, 1 | -1> | undefined;
    if (query.sortBy) {
      const order = query.sortOrder === 'ASC' ? 1 : -1;
      sort = { [query.sortBy]: order };
    }

    return { page, limit, skip, sort };
  }
}

export default PaginationUtil;
EOF

echo "Pagination util created. You need to implement the missing service methods."