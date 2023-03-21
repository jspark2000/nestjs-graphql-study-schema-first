import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users: Prisma.UserCreateManyInput[] = [
    {
      nickname: 'user01',
      email: 'user01@example.com',
      password: '1234',
    },
    {
      nickname: 'user02',
      email: 'user02@example.com',
      password: '1234',
    },
    {
      nickname: 'user03',
      email: 'user03@example.com',
      password: '1234',
    },
    {
      nickname: 'user04',
      email: 'user04@example.com',
      password: '1234',
    },
    {
      nickname: 'user05',
      email: 'user05@example.com',
      password: '1234',
    },
  ];

  await prisma.user.createMany({
    data: users,
  });

  const posts: Prisma.PostCreateManyInput[] = [
    {
      userId: 1,
      title: 'post1',
      content: 'content1',
      createdAt: new Date('2023-01-01'),
    },
    {
      userId: 1,
      title: 'post2',
      content: 'conten2',
      createdAt: new Date('2023-01-03'),
    },
    {
      userId: 2,
      title: 'post3',
      content: 'content3',
      createdAt: new Date('2023-01-04'),
    },
    {
      userId: 1,
      title: 'post4',
      content: 'content4',
      createdAt: new Date('2023-01-04'),
    },
    {
      userId: 2,
      title: 'post5',
      content: 'content5',
      createdAt: new Date('2023-01-05'),
    },
    {
      userId: 3,
      title: 'post6',
      content: 'content6',
      createdAt: new Date('2023-01-06'),
    },
    {
      userId: 3,
      title: 'post7',
      content: 'content7',
      createdAt: new Date('2023-01-07'),
    },
  ];

  await prisma.post.createMany({
    data: posts,
  });

  const comments: Prisma.CommentCreateManyInput[] = [
    {
      userId: 2,
      postId: 1,
      content: 'comment1',
      createdAt: new Date('2022-01-02'),
    },
    {
      userId: 1,
      postId: 1,
      content: 'comment2',
      createdAt: new Date('2022-01-02'),
    },
    {
      userId: 2,
      postId: 1,
      content: 'comment3',
      createdAt: new Date('2022-01-02'),
    },
    {
      userId: 1,
      postId: 2,
      content: 'comment3',
      createdAt: new Date('2022-01-03'),
    },
  ];

  await prisma.comment.createMany({
    data: comments,
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
