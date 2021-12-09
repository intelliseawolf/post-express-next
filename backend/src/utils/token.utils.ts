import jwt from "jsonwebtoken";
import { User } from "../interfaces/user.interface";

const generateToken = (user: Partial<User>): string =>
  jwt.sign(user, process.env.JWT_SECRET || "superSecret", { expiresIn: "2d" });

export default generateToken;
