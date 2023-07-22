import mongoose from "mongoose";

let schema = new mongoose.Schema({
  title: String,
  description: String,
  image: Array,
  price: Number,
  ingredients: Array,
  nutritionals: Array,
  categoryId: String,
  promotionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "promotions",
    default: null,
  },
  categoryName: String,
  restaurantRef: String,
});
export const productsModel = mongoose.model("products", schema);

//todo: correct model according on future requests (in future releases)
