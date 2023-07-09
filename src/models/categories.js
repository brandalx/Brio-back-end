import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
  },
  restaurantRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Restaurants",
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});

export const categoriesModel = mongoose.model("categories", categorySchema);
