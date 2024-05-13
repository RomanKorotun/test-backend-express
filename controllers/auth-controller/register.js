import bcryptjs from "bcryptjs";
import User from "../../models/User.js";
import { HttpError, sendEmail, cloudinary } from "../../helpers/index.js";
import { nanoid } from "nanoid";
import "dotenv/config";
import fs from "fs/promises";

const { BACKEND_URL } = process.env;

const register = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "User with this email is already in the database");
    }
    const hashPassword = await bcryptjs.hash(password, 10);
    const verifyCode = nanoid();

    let avatar =
      "https://res.cloudinary.com/drqeo1pu5/image/upload/v1715592762/avatars_test_backend_express/default_avatar_uvyyfd.png";

    if (req.file) {
      const { url } = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars_test_backend_express",
        use_filename: true,
        unique_filename: false,
      });
      avatar = url;
      await fs.unlink(req.file.path);
    }

    const newUser = await User.create({
      username,
      email,
      avatar,
      password: hashPassword,
      verifyCode,
    });
    console.log(newUser);
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BACKEND_URL}/api/auth/verify/${verifyCode}">Click to verify email</a>`,
    };
    await sendEmail(verifyEmail);
    res.status(201).json({
      username: newUser.username,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};
export default register;
