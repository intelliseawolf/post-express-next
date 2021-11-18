import {
  CreatePostInput,
  Post,
  UpdatePostInput,
} from "../interfaces/post.interface";
import { User } from "../interfaces/user.interface";
import prisma from "../../prisma/prisma-client";
import HttpException from "../http-exception";

const postSelectQuery = {
  id: true,
  title: true,
  content: true,
};

export const createPost = async (
  input: CreatePostInput,
  userId: string
): Promise<Post> => {
  const { title, content } = input;
  return await prisma.post.create({
    data: {
      title,
      content,
      user: {
        connect: {
          id: Number(userId),
        },
      },
    },
    select: postSelectQuery,
  });
};

export const getPosts = async (query: any, user: User) => {
  const { perPage, page } = query;
  let findManyQuery = {
    skip: Number(perPage) * Number(page) || 0,
    take: Number(perPage) || 5,
    select: {
      ...postSelectQuery,
      user: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
    where: {},
  };
  let countQuery = {
    where: {},
  };

  if (user.role !== "admin") {
    findManyQuery = {
      ...findManyQuery,
      where: {
        userId: Number(user.id),
      },
    };
    countQuery = {
      ...countQuery,
      where: {
        userId: Number(user.id),
      },
    };
  }

  const posts = await prisma.post.findMany(findManyQuery);
  const count = await prisma.post.count(countQuery);

  return {
    posts,
    count,
  };
};

export const getPost = async (id: string): Promise<Post> => {
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: postSelectQuery,
  });
  if (!post) throw new HttpException(404, {});

  return post;
};

export const updatePost = async (
  input: UpdatePostInput,
  id: string
): Promise<Post> => {
  const { title, content } = input;
  return await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title,
      content,
    },
    select: postSelectQuery,
  });
};

export const deletePost = async (id: string) => {
  return await prisma.post.delete({
    where: { id: Number(id) },
  });
};
