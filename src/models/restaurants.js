import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  title: String,
  address: String,
  location: String,
  image: String,
  reviews: Object,
  tags: Object,
  email: String,
  description: String,
  minprice: Number,
  time: String,
  phoneNumber: Number,
  company: String,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      validate: {
        validator: function (v) {
          return mongoose.Types.ObjectId.isValid(v);
        },
        message: "{VALUE} is not a valid ObjectId!",
      },
    },
  ],

  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "products" }],
});
const Restaurants = mongoose.model("Restaurants", restaurantSchema);
export default Restaurants;
