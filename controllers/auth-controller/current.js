const current = (req, res) => {
  const { username, email, avatar } = req.user;
  res.json({
    username,
    avatar,
    email,
  });
};
export default current;
