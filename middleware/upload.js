import multer from "multer";
import path from "path";
import { nanoid } from "nanoid";
import { HttpError } from "../helpers/index.js";

const destination = path.resolve("temp");

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const filePreffix = nanoid();
    const fileName = `${filePreffix}_${file.originalname}`;
    callback(null, fileName);
  },
});

const limits = {
  fieldSize: 1024 * 5,
};

const fileFilter = (req, file, callback) => {
  const extention = file.originalname.split(".").pop();
  if (extention === "exe") {
    return callback(HttpError(400, "Extention exe not valid"));
  }
  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

export default upload;
