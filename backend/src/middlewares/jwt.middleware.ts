import { Request } from "express";
import { expressjwt as jwt } from "express-jwt";

function getTokenFromHeaders(req: Request): string | undefined {
  if (
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Token") ||
    (req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer")
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return undefined;
}

export default jwt({
  secret: process.env.JWT_SECRET || "superSecret",
  getToken: getTokenFromHeaders,
  algorithms: ["HS256"],
});
