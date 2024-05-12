import express from "express";
import {
  authenticate,
  isEmptyBody,
  passportGoogle,
  upload,
} from "../../middleware/index.js";
import {
  googleAuth,
  register,
  veriFyEmailRepeat,
  verifyEmail,
  login,
  logout,
} from "../../controllers/auth-controller/index.js";
import { validateBody, ctrlWrapper } from "../../decorators/index.js";
import {
  loginJoiSchema,
  registerJoiSchema,
  verifyEmailRepeatSchema,
} from "../../models/User.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  upload.single("avatar"),
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
  passportGoogle.authenticate("google", { scope: ["email", "profile"] })
);

authRouter.get(
  "/google-redirect",
  passportGoogle.authenticate("google", { session: false }),
  ctrlWrapper(googleAuth)
);

authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(loginJoiSchema),
  ctrlWrapper(login)
);

authRouter.post("/logout", authenticate, ctrlWrapper(logout));

export default authRouter;
