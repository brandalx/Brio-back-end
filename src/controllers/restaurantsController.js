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

  async getRestaurantById(req, res) {
    let idParams = req.params.id;

    try {
      let data = await Restaurants.findById({ _id: idParams });
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
  async removeProductFromRestaurant(req, res) {
    const { id } = req.params;
    const { productId } = req.body;

    if (!productId) {
      return res
        .status(400)
        .json({ error: "No productId provided in the request body" });
    }

    try {
      const restaurant = await Restaurants.findById(id);
      if (restaurant) {
        const index = restaurant.products.findIndex(
          (prodId) => prodId.toString() === productId
        );

        if (index > -1) {
          restaurant.products.splice(index, 1);
        }

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
  async addProductToRestaurant(req, res) {
    const { id } = req.params;
    const { productId } = req.body;

    try {
      const restaurant = await Restaurants.findById(id);
      if (restaurant) {
        // Add product id to restaurant's products array
        restaurant.products.push(productId);

        // Save the updated restaurant
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

export default restaurantController;
