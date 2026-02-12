import { RefreshAuthGuard } from '@src/modules/auth/guards/refresh-auth/refresh-auth.guard';

describe('RefreshAuthGuard', () => {
  it('should be defined', () => {
    expect(new RefreshAuthGuard()).toBeDefined();
  });
});
