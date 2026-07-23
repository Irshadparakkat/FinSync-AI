import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedUser } from '../../auth/interfaces/jwt-payload.interface';

/**
 * The TENANT guard. Runs after JwtAuthGuard (request.user is populated)
 * and rejects principals that do not belong to a Family Workspace yet.
 * Every tenant-scoped controller (family read/update, members, and all
 * future financial modules) sits behind it - services can then trust
 * user.familyId to be present and scope every query with it.
 */
@Injectable()
export class FamilyContextGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as AuthenticatedUser | undefined;

    if (!user?.familyId) {
      throw new ForbiddenException('Create or join a family workspace first');
    }

    return true;
  }
}
