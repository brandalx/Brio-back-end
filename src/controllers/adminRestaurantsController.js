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
  async getAllRestaurants(req, res) {
    try {
      let data = await Restaurants.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  async updateRestaurantById(req, res) {
    let idParams = req.params.id;
    let updatedData = req.body;

    try {
      let data = await Restaurants.findByIdAndUpdate(idParams, updatedData, {
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
  async getRestaurantProducts(req, res) {
    let idParams = req.params.id;

    try {
      let restaurant = await Restaurants.findById(idParams);
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
  async addBadgeToRestaurant(req, res) {
    const { id } = req.params;
    const { badgeTitle, badgeEmoji } = req.body;

    if (!badgeTitle || !badgeEmoji) {
      return res
        .status(400)
        .json({ error: "Badge title and emoji are required" });
    }

    try {
      const restaurant = await Restaurants.findById(id);
      if (restaurant) {
        restaurant.tags.push({
          badgeTitle: badgeTitle,
          badgeEmoji: badgeEmoji,
        });

        const updatedRestaurant = await restaurant.save();

        res.status(200).json(updatedRestaurant);
      } else {
        res.status(404).json({ error: "Restaurant not found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err });
    }
  },
};

export default adminRestaurantsController;
