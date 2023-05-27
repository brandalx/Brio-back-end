import { categoriesModel } from "../models/categories.js";
const categoriesController = {
  async getAllCategories(req, res) {
    try {
      let data = await categoriesModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
};

export default categoriesController;
