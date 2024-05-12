import { HttpError } from "../helpers/index.js";
const isEmptyBody = (req, res, next) => {
  console.log(req.file);
  const length = Object.keys(req.body).length;
  if (length === 0 && !req.file) {
    return HttpError(400, "missing fields");
  }
  next();
};

export default isEmptyBody;
