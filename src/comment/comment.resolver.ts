import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Post, Comment, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query()
  async comments(): Promise<Comment[]> {
    return await this.prismaService.comment.findMany();
  }

  @ResolveField()
  async author(@Parent() comment: Comment): Promise<User> {
    const { userId } = comment;
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  @ResolveField()
  async post(@Parent() comment: Comment): Promise<Post> {
    const { postId } = comment;
    return await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    });
  }
}
