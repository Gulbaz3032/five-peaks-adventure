import { Router, Request, Response } from "express";
import passport from "../auth/googleStrategy";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req: any, res: Response) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        name: req.user.fullName,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

   
    res.json({
      message: "Login successful",
      token,
      accessToken: req.user.accessToken,
    });
  }
);


export default router