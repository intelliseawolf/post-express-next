import { Request, Response } from "express";

const IsAdmin = async (req: Request, res: Response, next: Function) => {
  if (req.auth?.role === "admin") return next();

  res.status(401).json({
    status: "error",
    message: "Missing authorization credentials",
  });
};

export default IsAdmin;
