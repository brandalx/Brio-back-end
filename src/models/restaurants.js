import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  title: String,
  address: String,
  location: String,
  image: String,
  reviews: Object,
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    unique: true,
  },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
});

const Restaurants = mongoose.model("Restaurants", restaurantSchema);

export default Restaurants;
