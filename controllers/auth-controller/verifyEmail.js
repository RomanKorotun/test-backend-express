import User from "../../models/User.js";
import { HttpError } from "../../helpers/index.js";

const verifyEmail = async (req, res) => {
  const { verifyCode } = req.params;
  const user = await User.findOne({ verifyCode });
  if (!user) {
    throw HttpError(400, "Email not found");
  }
  await User.findByIdAndUpdate(user._id, { verifyCode: "", verify: true });
  res.json({
    message: "Email verify success",
  });
};
export default verifyEmail;
