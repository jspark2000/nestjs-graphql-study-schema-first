
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CreateCommentInput {
    content: string;
}

export interface UpdateCommentInput {
    content: string;
}

export interface CreatePostInput {
    title: string;
    content: string;
}

export interface UpdatePostInput {
    id: number;
    title?: Nullable<string>;
    content?: Nullable<string>;
}

export interface Comment {
    id: number;
    post: Post;
    author: User;
    createdAt?: Nullable<Date>;
    content?: Nullable<string>;
}

export interface IQuery {
    comments(): Nullable<Comment>[] | Promise<Nullable<Comment>[]>;
    posts(): Nullable<Nullable<Post>[]> | Promise<Nullable<Nullable<Post>[]>>;
    post(id: number): Nullable<Post> | Promise<Nullable<Post>>;
    user(id: number): Nullable<User> | Promise<Nullable<User>>;
    users(): Nullable<User>[] | Promise<Nullable<User>[]>;
}

export interface IMutation {
    createComment(postId: number, input?: Nullable<CreateCommentInput>): Nullable<Comment> | Promise<Nullable<Comment>>;
    updateComment(id: number, input?: Nullable<UpdateCommentInput>): Nullable<Comment> | Promise<Nullable<Comment>>;
    deleteComment(id: number): Nullable<Comment> | Promise<Nullable<Comment>>;
    createPost(input?: Nullable<CreatePostInput>): Nullable<Post> | Promise<Nullable<Post>>;
    updatePost(input?: Nullable<UpdatePostInput>): Nullable<Post> | Promise<Nullable<Post>>;
    deletePost(id: number): Nullable<Post> | Promise<Nullable<Post>>;
}

export interface Post {
    id: number;
    author: User;
    createdAt?: Nullable<Date>;
    title?: Nullable<string>;
    content?: Nullable<string>;
    comments: Nullable<Comment>[];
}

export interface User {
    id: number;
    nickname?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    posts?: Nullable<Nullable<Post>[]>;
    comments?: Nullable<Nullable<Comment>[]>;
}

type Nullable<T> = T | null;
