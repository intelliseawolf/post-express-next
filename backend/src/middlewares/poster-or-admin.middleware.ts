import { Request, Response } from "express";

import prisma from "../../prisma/prisma-client";

const PosterOrAdmin = async (req: Request, res: Response, next: Function) => {
  const post = await prisma.post.findUnique({
    where: { id: Number(req.params.id) },
    select: {
      id: true,
      title: true,
      userId: true,
    },
  });

  if (!post) {
    return res.status(404).json({
      status: "error",
      message: "Not found",
    });
  }
  if (post.userId == req.auth.id || req.auth.role === "admin") return next();

  return res.status(401).json({
    status: "error",
    message: "Missing authorization credentials",
  });
};

export default PosterOrAdmin;
