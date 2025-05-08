import { Request, Response, NextFunction } from "express";
import { InsufficientPermissionsException } from "../../../shared/errors/http-exception";

export const verifyRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // assuming this will run after the verifyToken middleware and that the user can't alter req.user
  const user = req.user!;

  if (user.role !== "admin") {
    throw new InsufficientPermissionsException("Invalid user role");
  }
  next();
};
