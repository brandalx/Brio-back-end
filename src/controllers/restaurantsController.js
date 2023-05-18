import { restaurantClientModel } from "../models/restaurant.js";
const restaurantController = {
  async getAllRestaurants(req, res) {
    try {
      let data = await restaurantClientModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },

  async getRestaurantById(req, res) {
    let idParams = req.params.id;

    try {
      let data = await restaurantClientModel.findById({ _id: idParams });
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
  async getRestaurantProducts(req, res) {
    let idParams = req.params.id;

    try {
      let restaurant = await restaurantClientModel.findById(idParams);
      if (restaurant) {
        let data = restaurant.products;
        res.json({ products: data });
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
};

export default restaurantController;
