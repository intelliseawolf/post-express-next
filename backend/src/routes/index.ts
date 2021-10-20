import { Router } from "express";

import AuthController from "../controllers/auth.controller";
import UserController from "../controllers/user.controller";
import PostController from "../controllers/post.controller";

import jwtMiddleware from "../middlewares/jwt.middleware";
import IsAdmin from "../middlewares/admin.middleware";

const api = Router()
  .use(AuthController)
  .use("/users", jwtMiddleware, IsAdmin, UserController)
  .use("/posts", jwtMiddleware, PostController);

export default Router().use("/api", api);
