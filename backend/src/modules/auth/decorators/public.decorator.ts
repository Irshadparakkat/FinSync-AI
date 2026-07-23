import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from '../constants/auth.constants';

/**
 * Marks a route as accessible without authentication.
 * The global JwtAuthGuard protects everything else by default
 * (secure-by-default: forgetting a decorator can never expose data).
 */
export const Public = (): MethodDecorator & ClassDecorator => SetMetadata(IS_PUBLIC_KEY, true);
