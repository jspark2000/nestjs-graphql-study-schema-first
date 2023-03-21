import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Post, Comment, User } from '@prisma/client';
import { CreatePostInput, UpdatePostInput } from 'src/graphql';
import { PrismaService } from 'src/prisma/prisma.service';

@Resolver('Post')
export class PostResolver {
  constructor(private readonly prismaService: PrismaService) {}

  @Query()
  async post(@Args('id') id: number): Promise<Post> {
    return await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
  }

  @Query()
  async posts(): Promise<Post[]> {
    return await this.prismaService.post.findMany();
  }

  @Mutation()
  async createPost(@Args('input') input: CreatePostInput) {
    return await this.prismaService.post.create({
      data: {
        ...input,
        createdAt: new Date(),
      },
    });
  }

  @Mutation()
  async updatePost(@Args('input') input: UpdatePostInput) {
    return await this.prismaService.post.update({
      where: {
        id: input.id,
      },
      data: {
        title: input.title,
        content: input.content,
      },
    });
  }

  @ResolveField()
  async author(@Parent() post: Post): Promise<User> {
    const { userId } = post;
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  @ResolveField()
  async comments(@Parent() post: Post): Promise<Comment[]> {
    const { id } = post;
    return await this.prismaService.comment.findMany({
      where: {
        postId: id,
      },
    });
  }
}
