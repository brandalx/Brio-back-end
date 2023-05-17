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
  async getProductById(req, res) {
    let idParams = req.params.id;

    try {
      let data = await productsModel.findById({ _id: idParams });
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: "Product not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
};

export default productsController;
