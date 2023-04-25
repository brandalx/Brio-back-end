import mongoose from "mongoose";
// Schema to make request to the Mongo DB

let schema = new mongoose.Schema({
  title: String,
  adress: String,
  location: String,
  image: String,
  reviews: Object,
  company: String,
});
export const restaurantClientModel = mongoose.model("toys", schema);
