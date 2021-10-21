import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import prisma from "../../prisma/prisma-client";
import jwtMiddleware from "../middlewares/jwt.middleware";

import validateionMiddleware from "../middlewares/validation.middleware";
import { login, register } from "../services/auth.service";

const router = Router();
const validate = (method: string) => {
  switch (method) {
    case "register": {
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
      ];
    }

    case "login": {
      return [
        body("email", "Invalid email").exists().isEmail(),
        body("password", "Password length must be greater than 6").isLength({
          min: 6,
        }),
      ];
    }

    default:
      return [];
  }
};

router.post(
  "/register",
  validate("register"),
  validateionMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await register(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  "/login",
  validate("login"),
  validateionMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await login(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/me",
  jwtMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, email, firstname, lastname, role } = req.auth;
      res.json({
        id,
        email,
        firstname,
        lastname,
        role,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
