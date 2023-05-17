import Restaurants from "../models/restaurants.js";

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

  async adminGetRestaurantsMenu(req, res) {
    try {
      const { id } = req.params;
      const restaurant = await Restaurants.findById(id).populate("products");
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
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
