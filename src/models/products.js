import mongoose from "mongoose";

let schema = new mongoose.Schema({
  title: String,
  description: String,
  image: Array,
  price: Number,
  ingredients: Array,
  nutritionals: Array,
  categoryName: String,
  restaurantRef: String,
});
export const productsModel = mongoose.model("products", schema);

//todo: correct model according on future requests (in future releases)
