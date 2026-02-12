import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsJwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = this.extractToken(client);

    if (!token) {
      // Allow connection but restrict certain operations
      return this.handleUnauthenticated(client);
    }

    try {
      const payload = this.jwtService.verify(token);
      client.data.user = payload;
      return true;
    } catch (error) {
      return this.handleInvalidToken(client, error);
    }
  }

  private extractToken(client: any): string | null {
    const authHeader = client.handshake.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    return client.handshake.auth?.token || null;
  }

  private handleUnauthenticated(client: any): boolean {
    // Allow connection but mark as unauthenticated
    client.data.user = null;
    return true;
  }

  private handleInvalidToken(client: any, error: Error): boolean {
    client.emit('auth_error', {
      code: 'INVALID_TOKEN',
      message: 'Invalid or expired token',
      timestamp: new Date().toISOString(),
    });
    return false;
  }
}
