import bcrypt from "bcryptjs";

import prisma from "../../prisma/prisma-client";
import {
  LoginResult,
  RegisteredUser,
  RegisterInput,
  LoginInput,
} from "../interfaces/auth.interface";
import generateToken from "../utils/token.utils";
import HttpException from "../http-exception";

export const register = async (
  input: RegisterInput
): Promise<RegisteredUser> => {
  const { email, password, firstname, lastname } = input;
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstname,
      lastname,
    },
    select: {
      id: true,
      email: true,
    },
  });
};

export const login = async (input: LoginInput): Promise<LoginResult> => {
  const { email, password } = input;
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: {
      id: true,
      email: true,
      password: true,
      firstname: true,
      lastname: true,
      status: true,
      role: true,
    },
  });

  if (user) {
    if (!user.status)
      throw new HttpException(400, {
        errors: ["Wait until approve!"],
      });

    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return {
        id: user.id,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        status: user.status,
        role: user.role,
        token: generateToken(user),
      };
    }
  }

  throw new HttpException(403, {
    errors: ["Email or password is invalid"],
  });
};
