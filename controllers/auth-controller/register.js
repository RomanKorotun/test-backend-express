import bcryptjs from "bcryptjs";
import User from "../../models/User.js";
import { HttpError, sendEmail } from "../../helpers/index.js";
import { nanoid } from "nanoid";

const { BACKEND_URL } = process.env;

const register = async (req, res) => {
  const { email, password, username } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "user with this email is already in the database");
  }
  const hashPassword = await bcryptjs.hash(password, 10);
  const verifyCode = nanoid();
  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
    verifyCode,
  });
  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BACKEND_URL}/api/auth/verify/${verifyCode}">Click to verify email</a>`,
  };
  await sendEmail(verifyEmail);
  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};
export default register;
