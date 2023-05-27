import Restaurants from "../models/restaurants.js";
const restaurantController = {
  async getAllRestaurants(req, res) {
    try {
      let data = await Restaurants.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
};

export default restaurantController;
