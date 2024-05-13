import { HttpError } from "../helpers/index.js";
const isEmptyBody = (req, res, next) => {
  const length = Object.keys(req.body).length;
  if (length === 0 && !req.file) {
    return HttpError(400, "Missing fields");
  }
  next();
};

export default isEmptyBody;
