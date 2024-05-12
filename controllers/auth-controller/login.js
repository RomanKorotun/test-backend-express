import { HttpError } from "../../helpers/index.js";
import User from "../../models/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config"

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_TIME,
  JWT_REFRESCH_TOKEN_SECRET,
  JWT_REFRESCH_TOKEN_TIME,
} = process.env;

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "Email or password wrong");
  }
  if (!user.verify) {
    throw HttpError(401, "Email not verify");
  }
  const passwordCompare = await bcryptjs.compare(password, user.password);
  if (!passwordCompare) {
    throw HttpError(400, "Email or password wrong");
  }
  const payload = {
    id: user._id,
  };
  const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_TIME,
  });
  const refreschToken = jwt.sign(payload, JWT_REFRESCH_TOKEN_SECRET, {
    expiresIn: JWT_REFRESCH_TOKEN_TIME,
  });

  await User.findByIdAndUpdate(user._id, { accessToken, refreschToken });

  res.json({
    username: user.username,
    email: user.email,
    accessToken,
    refreschToken,
  });
};

export default login;
