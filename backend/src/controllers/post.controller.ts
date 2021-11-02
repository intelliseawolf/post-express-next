import { NextFunction, Request, response, Response, Router } from "express";
import { body } from "express-validator";

import PosterOrAdmin from "../middlewares/poster-or-admin.middleware";
import validationMiddleware from "../middlewares/validation.middleware";
import {
  createPost,
  deletePost,
  getPost,
  getPosts,
  updatePost,
} from "../services/post.service";

const router = Router();
const validate = (method: string) => {
  switch (method) {
    case "upsertPost": {
      return [
        body("title", "Title required").exists(),
        body("content", "Content required").exists(),
      ];
    }

    default:
      return [];
  }
};

router.post(
  "/",
  validate("upsertPost"),
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await createPost(req.body, req.auth?.id);
      res.send({ post });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { posts, count } = await getPosts(req.query, req.auth);
    res.send({ posts, count });
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  PosterOrAdmin,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await getPost(req.params.id);
      res.send({ post });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/:id",
  validate("upsertPost"),
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await updatePost(req.body, req.params.id);
      res.send({ post });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const post = await deletePost(req.params.id);
      res.send({ post });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
