import User from "../../models/User.js";
import { HttpError } from "../../helpers/index.js";

const veriFyEmailRepeat = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(400, "Email not found");
  }
  if (user.verify) {
    throw HttpError(400, "Email has already been verified");
  }
  await User.findByIdAndUpdate(user._id, { verify: true, verifyCode: "" });
  res.json({
    message: "Email verify success",
  });
};
export default veriFyEmailRepeat;
