import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post, Comment, User } from '@prisma/client';
import { AuthenticatedRequest } from 'src/auth/interface/authenticated-request.interface';
import { CreateCommentInput, UpdateCommentInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query()
  async comments(): Promise<Comment[]> {
    return await this.prismaService.comment.findMany();
  }

  @Mutation()
  async createComment(
    @Args('input') input: CreateCommentInput,
    @Args('postId') postId: number,
    @Context('req') request: AuthenticatedRequest,
  ): Promise<Comment> {
    return await this.prismaService.comment.create({
      data: {
        postId,
        userId: request.user.id,
        createdAt: new Date(),
        ...input,
      },
    });
  }

  @Mutation()
  async updateComment(
    @Args('input') input: UpdateCommentInput,
    @Args('id') id: number,
  ): Promise<Comment> {
    return await this.prismaService.comment.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
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
