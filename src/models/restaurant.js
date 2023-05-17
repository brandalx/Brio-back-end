import mongoose from "mongoose";
// Schema to make request to the Mongo DB

let schema = new mongoose.Schema({
  title: String,
  address: String,
  location: String,
  image: String,
  reviews: Object,
  company: String,
  products: Array,
});
export const restaurantClientModel = mongoose.model("restaurants", schema);

//todo: correct model according on future requests (in future releases)
