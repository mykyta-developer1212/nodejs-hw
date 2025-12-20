import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { User } from "../models/user.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createHttpError(401, "Missing access token");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw createHttpError(401, "Missing access token");
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw createHttpError(401, "Invalid or expired token");
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw createHttpError(404, "User not found");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
