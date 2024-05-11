import jwt from "jsonwebtoken";
import "dotenv/config";

const {
  JWT_ACCESS_TOKEN_SECRET,
  JWT_REFRESCH_TOKEN_SECRET,
  JWT_ACCESS_TOKEN_TIME,
  JWT_REFRESCH_TOKEN_TIME,
  FRONTEND_URL,
} = process.env;

const googleAuth = (req, res) => {
  const payload = {
    id: req.user._id,
  };
  const accessToken = jwt.sign(payload, JWT_ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_ACCESS_TOKEN_TIME,
  });
  const refreschToken = jwt.sign(payload, JWT_REFRESCH_TOKEN_SECRET, {
    expiresIn: JWT_REFRESCH_TOKEN_TIME,
  });
  res.redirect(
    `${FRONTEND_URL}?access_token=${accessToken}&refresch_token=${refreschToken}`
  );
};
export default googleAuth;
