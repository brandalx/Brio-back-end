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
  async deleteProductById(req, res) {
    try {
      let idParams = req.params.id;
      const data = await productsModel.findByIdAndDelete(idParams);

      if (!data) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.json(data);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
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
  async updateProductById(req, res) {
    let idParams = req.params.id;
    let updatedData = req.body;

    try {
      let data = await productsModel.findByIdAndUpdate(idParams, updatedData, {
        new: true,
      });
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

  async createProduct(req, res) {
    const {
      title,
      description,
      image,
      price,
      ingredients,
      nutritionals,
      categoryName,
      restaurantRef,
    } = req.body;

    try {
      const newProduct = await productsModel.create({
        title,
        description,
        image,
        price,
        ingredients,
        nutritionals,
        categoryName,
        restaurantRef,
      });
      res.json(newProduct);
    } catch (err) {
      console.error(err);
      res.status(502).json({ error: err });
    }
  },
};

export default productsController;
