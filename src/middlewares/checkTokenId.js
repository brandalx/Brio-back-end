export const checkTokenId = async (req, res, next) => {
  const id = req.tokenData._id;
  if (!id) {
    return res.status(400).json({ error: "token id required" });
  }
  req.userId = id;
  next();
};
