import bcrypt from "bcryptjs";

import {
  CreateUserInput,
  CreateUserResult,
  UpdateUserInput,
  User,
} from "../interfaces/user.interface";
import prisma from "../../prisma/prisma-client";
import HttpException from "../http-exception";

const userSelectQuery = {
  id: true,
  email: true,
  firstname: true,
  lastname: true,
  role: true,
  status: true,
};

export const createUser = async (
  input: CreateUserInput
): Promise<CreateUserResult> => {
  const { email, password, firstname, lastname, role } = input;
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstname,
      lastname,
      role,
    },
    select: {
      id: true,
      email: true,
    },
  });
};

export const getUsers = async (query: any) => {
  const { perPage, page } = query;

  const users = await prisma.user.findMany({
    skip: Number(perPage) * Number(page) || 0,
    take: Number(perPage) || 5,
    select: userSelectQuery,
  });
  const count = await prisma.user.count();

  return {
    users,
    count,
  };
};

export const getUser = async (id: number): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: userSelectQuery,
  });
  if (!user) {
    throw new HttpException(404, {});
  }

  return user;
};

export const updateUser = async (
  id: number,
  input: UpdateUserInput
): Promise<User> => {
  const { firstname, lastname, role, status } = input;

  return await prisma.user.update({
    where: { id },
    data: {
      firstname,
      lastname,
      role,
      status,
    },
    select: userSelectQuery,
  });
};

export const deleteUser = async (id: number) => {
  return await prisma.user.delete({
    where: { id },
    select: {
      id: true,
      email: true,
    },
  });
};

export const toggleUserStatus = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    throw new HttpException(404, {});
  }

  return await prisma.user.update({
    where: { id },
    data: {
      status: !user.status,
    },
    select: {
      id: true,
      email: true,
    },
  });
};
