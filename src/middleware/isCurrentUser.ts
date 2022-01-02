import { Response, Request, NextFunction } from "express";

export const isCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.currentUser!) return res.status(403).send("Access forbidden.");
  next();
};
