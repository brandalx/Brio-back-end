import { productsModel } from "../models/products.js";
import { ordersModel } from "../models/orders.js";

const adminProductsController = {
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productsModel.findOne({ id: id });
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  }
};

export default adminProductsController;
