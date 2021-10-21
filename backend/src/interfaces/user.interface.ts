import { Role } from "@prisma/client";

export interface User {
  id?: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
  status: boolean;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: Role;
}

export interface CreateUserResult {
  id: number;
  email: string;
}

export interface UpdateUserInput {
  firstname: string;
  lastname: string;
  role: Role;
  status: boolean;
}
