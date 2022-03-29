import { User } from "./user.interface";

export interface Post {
  id: number;
  title: string;
  content: string;
  userId?: number;
  user?: User;
}
