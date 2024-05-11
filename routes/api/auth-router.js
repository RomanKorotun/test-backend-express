import express from "express";
import { isEmptyBody, passport } from "../../middleware/index.js";
import {
  googleAuth,
  register,
  veriFyEmailRepeat,
  verifyEmail,
} from "../../controllers/auth-controller/index.js";
import { validateBody, ctrlWrapper } from "../../decorators/index.js";
import {
  registerJoiSchema,
  verifyEmailRepeatSchema,
} from "../../models/User.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(registerJoiSchema),
  ctrlWrapper(register)
);

authRouter.get("/verify/:verifyCode", ctrlWrapper(verifyEmail));

authRouter.post(
  "/verify",
  validateBody(verifyEmailRepeatSchema),
  ctrlWrapper(veriFyEmailRepeat)
);

authRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get(
  "/google-redirect",
  passport.authenticate("google", { session: false }),
  ctrlWrapper(googleAuth)
);

export default authRouter;
