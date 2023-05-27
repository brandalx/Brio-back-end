import { productsModel } from "../models/products.js";
const productsController = {
  async getAllProducts(req, res) {
    try {
      let data = await productsModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
};

export default productsController;
