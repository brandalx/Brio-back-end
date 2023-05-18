const chatController = {
  getChat(req, res) {
    try {
      res.json({ message: "Chat endpoint" });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};
export default chatController;
