import {productsModel} from "../models/products.js";

const adminProductsController = {
  async getProductById(req, res) {
    const { id } = req.params;

    try {
      const product = await productsModel.findById(id);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Server error" });
    }
  },
};

export default adminProductsController;
