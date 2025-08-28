import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/protected", (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    res.json({ message: "Protected route accessed", user: decoded });
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
  }
});

export default router;
