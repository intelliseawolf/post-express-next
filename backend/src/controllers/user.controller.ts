import { NextFunction, Request, Response, Router } from "express";
import { body } from "express-validator";

import prisma from "../../prisma/prisma-client";
import validationMiddleware from "../middlewares/validation.middleware";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  toggleUserStatus,
  updateUser,
} from "../services/user.service";

const router = Router();
const validate = (method: string) => {
  switch (method) {
    case "createUser": {
      return [
        body("email", "Invalid email").exists().isEmail(),
        body("email").custom((value) => {
          return prisma.user
            .findMany({
              where: { email: value },
            })
            .then((user) => {
              if (user.length > 0) {
                return Promise.reject("Email already in use");
              }
            });
        }),
        body("password", "Password length must be greater than 6").isLength({
          min: 6,
        }),
        body("firstname", "First name required").exists(),
        body("lastname", "Last name required").exists(),
        body("role")
          .exists()
          .withMessage("Role required")
          .isIn(["admin", "user"])
          .withMessage("Invalid role"),
      ];
    }

    case "updateUser": {
      return [
        body("firstname", "First name required").exists(),
        body("lastname", "Last name required").exists(),
        body("role")
          .exists()
          .withMessage("Role required")
          .isIn(["admin", "user"])
          .withMessage("Invalid role"),
        body("status")
          .exists()
          .withMessage("Status required")
          .isBoolean()
          .withMessage("Invalid status"),
      ];
    }

    default:
      return [];
  }
};

router.post(
  "/",
  validate("createUser"),
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await createUser(req.body);
      res.send({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { users, count } = await getUsers(req.query);
    res.send({ users, count });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUser(Number(req.params.id));
    res.send({ user });
  } catch (error) {
    next(error);
  }
});

router.put(
  "/:id",
  validate("updateUser"),
  validationMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await updateUser(Number(req.params.id), req.body);
      res.send({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await deleteUser(Number(req.params.id));
      res.send({ user });
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/:id/toggleStatus",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await toggleUserStatus(Number(req.params.id));
      res.send({ user });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
