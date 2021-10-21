import { User } from "./user.interface";

export interface RegisterInput {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface RegisteredUser {
  id: number;
  email: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult extends User {
  token: string;
}
