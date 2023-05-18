import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "ORGANIZATION", //todo: pass organization key here after purchare
  apiKey: "KEY",
  //todo: pass api key here after purchare
});

const openai = new OpenAIApi(configuration);

const chatController = {
  getChat(req, res) {
    try {
      res.json({ message: "Chat endpoint" });
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },

  async postChat(req, res) {
    try {
      const chatResponse = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: req.body }],
      });

      console.log(chatResponse.data.choices[0].message.content);

      res.json({ message: chatResponse.data.choices[0].message.content });
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
};

export default chatController;
