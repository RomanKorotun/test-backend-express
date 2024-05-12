import { HttpError } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/User.js";

const { JWT_ACCESS_TOKEN_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Authorization not found"));
  }
  const [Bearer, token] = authorization.split(" ");
  if (Bearer !== "Bearer") {
    return next(HttpError(401, "Authorization row not valid"));
  }
  try {
    const { id } = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
    const user = await User.findById(id);
    if (!user || !user.accessToken || user.accessToken !== token) {
      return next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};
export default authenticate;
