import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { InvalidCredentialsException } from "../../../shared/errors/http-exception";
import { config } from "../../../shared/config";
import { JwtPayload } from "../types/auth.types";
import authService from "../services/auth.service";
import userRepository from "@/modules/users/repositories/user.repository";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    throw new InvalidCredentialsException("No token provided");
  }

  const payload = verify(token, config.jwt.secret);
  if (typeof payload === "string") {
    throw new InvalidCredentialsException("Invalid payload format");
  }
  if (!payload.sub) {
    throw new InvalidCredentialsException("Invalid token provided");
  }
  const user = await userRepository.getById(payload.sub);

  req.user = user;
  next();
};
