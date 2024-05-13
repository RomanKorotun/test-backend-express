import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../../models/User.js";
import { HttpError } from "../../helpers/index.js";

const {
  JWT_REFRESCH_TOKEN_SECRET,
  JWT_REFRESCH_TOKEN_TIME,
  JWT_ACCESS_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_TIME,
} = process.env;

const refresch = async (req, res) => {
  try {
    const { refreschToken: token } = req.body;
    const { id } = jwt.verify(token, JWT_REFRESCH_TOKEN_SECRET);
    const user = await User.findById(id);
    if (!user || !user.refreschToken || user.refreschToken !== token) {
      throw HttpError(403, "User not authorized");
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
    res.json({
      accessToken,
      refreschToken,
    });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};
export default refresch;
