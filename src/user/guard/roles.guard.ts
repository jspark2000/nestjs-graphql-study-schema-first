import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { ROLES_KEY } from 'src/common/decorator/roles.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { type AuthenticatedRequest } from '../../auth/interface/authenticated-request.interface';
import { IS_AUTH_NOT_NEEDED_KEY } from 'src/common/decorator/auth-ignore.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  #rolesHierarchy = {};

  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {
    Object.keys(Role).forEach((key, index) => {
      this.#rolesHierarchy[key] = index;
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthNotNeeded = this.reflector.getAllAndOverride<boolean>(
      IS_AUTH_NOT_NEEDED_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isAuthNotNeeded) {
      return true;
    }

    let role = this.reflector.getAllAndOverride<Role>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!role) {
      role = Role.User;
    }

    const request: AuthenticatedRequest =
      context.getType() === 'http'
        ? context.switchToHttp().getRequest()
        : GqlExecutionContext.create(context).getContext().req;

    const userRole = await this.prismaService.user.findUnique({
      where: {
        id: request.user.id,
      },
      select: {
        role: true,
      },
    });

    if (this.#rolesHierarchy[userRole.role] >= this.#rolesHierarchy[role]) {
      request.user.role = userRole.role;
      return true;
    }
    return false;
  }
}
