import { User } from "./user.interface";

export interface CreatePostInput {
  title: string;
  content: string;
}

export interface Post {
  id?: number;
  title: string;
  content: string;
  userId?: number;
  user?: User;
}

export interface UpdatePostInput {
  title: string;
  content: string;
}
