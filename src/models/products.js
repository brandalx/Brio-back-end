import mongoose from "mongoose";

let schema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String,
  image: Array,
  price: Number,
  ingredients: Array,
  nutritionals: Array,
  categoryId: Number,
  restaurantRef: Number,
});
export const productsModel = mongoose.model("products", schema);

//todo: correct model according on future requests (in future releases)
