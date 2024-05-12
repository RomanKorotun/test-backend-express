import User from "../../models/User.js";
const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: "", refreschToken: "" });
  res.json({
    message: "Logout success",
  });
};
export default logout;
