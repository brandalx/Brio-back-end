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
};

export default restaurantController;
