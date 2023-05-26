import Restaurants from "../models/restaurants.js";
import { productsModel } from "../models/products.js";

const adminRestaurantsController = {
  async getRestaurantById(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurants.findById(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
      res.json({ restaurant });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
  async updateRestaurantById(req, res) {
    let idParams = req.params.id;
    let updatedData = req.body;

    try {
      let data = await productsModel.findByIdAndUpdate(idParams, updatedData, {
        new: true,
      });
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async adminGetRestaurantsMenu(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurants.findById(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant menu not found" });
      }
      const menu = restaurant.products;
      res.json(menu);
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },
};

export default adminRestaurantsController;
