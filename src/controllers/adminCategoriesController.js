import { categoriesModel } from "../models/categories.js";
import Restaurants from "../models/restaurants.js";
import { productsModel } from "../models/products.js";

const adminCategoriesController = {
  async getAllCategories(req, res) {
    try {
      let data = await categoriesModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  async getCategoryById(req, res) {
    let idParams = req.params.id;

    try {
      let data = await categoriesModel.findById({ _id: idParams });
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: "Category not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async createCategory(req, res) {
    const { restaurantId, categoryName, itemsId } = req.body;

    try {
      const newCategory = await categoriesModel.create({
        categoryName,
        restaurantRef: restaurantId,
        products: itemsId,
      });

      const restaurant = await Restaurants.findById(restaurantId);
      if (!restaurant) {
        throw new Error("Restaurant not found");
      }

      if (restaurant) {
        if (!newCategory._id) {
          console.error("newCategory._id is empty");
          throw new Error("Invalid category id");
        }
        if (restaurant.categories) {
          restaurant.categories.push(newCategory._id);
        } else {
          restaurant.categories = [newCategory._id];
        }
        await restaurant.save().catch((err) => {
          console.error("Error while saving the restaurant:", err);
          throw err; // To stop the execution
        });
      } else {
        console.error(`Restaurant with id ${restaurantId} not found`);
      }

      res.json(newCategory);
    } catch (err) {
      console.error(err);
      res.status(502).json({ error: err.message });
    }
  },
};

export default adminCategoriesController;
