import { Request, Response } from "express";
import { validationResult } from "express-validator";

const validationMiddleware = (req: Request, res: Response, next: Function) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array() });
    return;
  }

  next();
};

export default validationMiddleware;
