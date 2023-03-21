import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Post, Comment, User, Role } from '@prisma/client';
import { Roles } from 'src/common/decorator/roles.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('User')
export class UserResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query()
  async user(@Args('id') id: number): Promise<User> {
    return await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });
  }

  @Query()
  @Roles(Role.Admin)
  async users(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  @ResolveField()
  async posts(@Parent() user: User): Promise<Post[]> {
    const { id } = user;
    return await this.prismaService.post.findMany({
      where: {
        userId: id,
      },
    });
  }

  @ResolveField()
  async comments(@Parent() user: User): Promise<Comment[]> {
    const { id } = user;
    return await this.prismaService.comment.findMany({
      where: {
        userId: id,
      },
    });
  }
}
