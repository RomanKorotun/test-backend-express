import { nanoid } from "nanoid";
import User from "../../models/User.js";
import "dotenv/config";
import bcryptjs from "bcryptjs";
import fs from "fs/promises";
import { sendEmail, cloudinary } from "../../helpers/index.js";

const { BACKEND_URL } = process.env;

const updateUser = async (req, res) => {
  try {
    const { _id } = req.user;
    const { email: newEmail, password, username } = req.body;
    const verifyCode = nanoid();
    const verifyEmail = {
      to: newEmail,
      subject: "Verify email",
      html: `<a target="_blank" href="${BACKEND_URL}/api/auth/verify/${verifyCode}">Click to verify email</a>`,
    };
    //========================================1=========================
    if (!req.file && !password && newEmail) {
      const user = await User.findByIdAndUpdate(_id, {
        ...req.body,
        verify: false,
        verifyCode,
        accessToken: "",
        refreschToken: "",
      });
      await sendEmail(verifyEmail);
      return res.json({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      });
    }
    //========================================/1=========================
    //========================================2=========================
    if (!req.file && password && newEmail) {
      const newPasswordHash = await bcryptjs.hash(password, 10);
      const user = await User.findByIdAndUpdate(_id, {
        ...req.body,
        password: newPasswordHash,
        verify: false,
        verifyCode,
        accessToken: "",
        refreschToken: "",
      });
      await sendEmail(verifyEmail);
      return res.json({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      });
    }
    //========================================/2=========================
    //=======================================3==========================
    if (!req.file && password && !newEmail) {
      const newPasswordHash = await bcryptjs.hash(password, 10);
      const user = await User.findByIdAndUpdate(_id, {
        ...req.body,
        password: newPasswordHash,
      });
      return res.json({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      });
    }
    //========================================/3=========================
    //========================================4=========================
    if (req.file && !password && !newEmail) {
      const { url: avatar } = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars_test_backend_express",
        use_filename: true,
        unique_filename: false,
      });
      await fs.unlink(req.file.path);
      const user = await User.findByIdAndUpdate(_id, {
        ...req.body,
        avatar,
      });
      return res.json({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      });
    }
    //========================================/4=========================
    //========================================5=========================
    if (req.file && password && !newEmail) {
      const { url: avatar } = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars_test_backend_express",
        use_filename: true,
        unique_filename: false,
      });
      await fs.unlink(req.file.path);
      const newPasswordHash = await bcryptjs.hash(password, 10);
      const user = await User.findByIdAndUpdate(_id, {
        ...req.body,
        avatar,
        password: newPasswordHash,
      });
      return res.json({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      });
    }
    //========================================/5=========================
    //========================================6=========================
    if (req.file && password && newEmail) {
      const { url: avatar } = await cloudinary.uploader.upload(req.file.path, {
        folder: "avatars_test_backend_express",
        use_filename: true,
        unique_filename: false,
      });
      await fs.unlink(req.file.path);
      const newPasswordHash = await bcryptjs.hash(password, 10);
      const user = await User.findByIdAndUpdate(_id, {
        ...req.body,
        avatar,
        password: newPasswordHash,
        verify: false,
        verifyCode,
        accessToken: "",
        refreschToken: "",
      });
      await sendEmail(verifyEmail);
      return res.json({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      });
    }
    //========================================/6=========================
    //========================================7=========================
    if (username) {
      const user = await User.findByIdAndUpdate(_id, {
        username,
      });
      return res.json({
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      });
    }
    //========================================/7=========================
  } catch (error) {
    await fs.unlink(req.file.path);
    throw error;
  }
};
export default updateUser;
