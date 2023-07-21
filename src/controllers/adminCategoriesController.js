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
  async deleteCategory(req, res) {
    const categoryId = req.params.id;

    try {
      // Find the category
      const category = await categoriesModel.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Find the restaurant and remove the category from it
      const restaurant = await Restaurants.findById(category.restaurantRef);
      if (restaurant) {
        const index = restaurant.categories.indexOf(categoryId);
        if (index > -1) {
          restaurant.categories.splice(index, 1);
          // Remove all products belonging to this category from the restaurant
          restaurant.products = restaurant.products.filter(
            (productId) => !category.products.includes(productId)
          );
          await restaurant.save();
        }
      }

      // Remove all products belonging to this category
      await productsModel.deleteMany({ _id: { $in: category.products } });

      // Remove the category
      await categoriesModel.findByIdAndRemove(categoryId);

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error deleting category" });
    }
  },

  async updateCategoryById(req, res) {
    let idParams = req.params.id;

    try {
      let data = await categoriesModel.findOneAndUpdate(
        { _id: idParams },
        req.body,
        { new: true }
      );
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
  async getCategoriesByRestaurant(req, res) {
    let restaurantId = req.query.restaurantRef;

    try {
      let data = await categoriesModel.find({ restaurantRef: restaurantId });
      if (data) {
        res.json(data);
      } else {
        res
          .status(404)
          .json({ error: "No categories found for this restaurant" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },

  async addProductToCategory(req, res) {
    const { categoryId, productId } = req.params;

    try {
      const category = await categoriesModel.findById(categoryId);
      if (!category) {
        throw new Error("Category not found");
      }

      try {
        category.products.push(productId);
      } catch (err) {
        console.error("Error while pushing the product to the category:", err);
        res.status(502).json({ error: err.message });
        return; // To stop the execution
      }

      try {
        await category.save();
      } catch (err) {
        console.error("Error while saving the category:", err);
        res.status(502).json({ error: err.message });
        return; // To stop the execution
      }

      res.json(category);
    } catch (err) {
      console.error(err);
      res.status(502).json({ error: err.message });
    }
  },

  async createCategory(req, res) {
    const { restaurantId, categoryName, itemsId } = req.body;

    try {
      // Check if a category with the same name already exists in the restaurant
      const existingCategory = await categoriesModel.findOne({
        restaurantRef: restaurantId,
        categoryName: categoryName,
      });
      if (existingCategory) {
        return res
          .status(400)
          .json({
            error: "Category with this name already exists in the restaurant",
          });
      }

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
