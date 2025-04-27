import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (jwtSecret: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Missing token" });
      return;
    }

    const token = authHeader ? authHeader.split(" ")[1] : "";
    try {
      const payload = jwt.verify(token, jwtSecret) as { userId: string };
      (req as Request & { userId?: string }).userId = payload.userId;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
  };
};
