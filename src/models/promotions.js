import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  discountDetails: String,
  startDate: String,
  endDate: String,
  image: String,
  discountPercent: Number,
  discountProducts: Object,
  restaurantName: String,
  restaurantRef: String,
  discountDays: Array,
});

const promotionsModel = mongoose.model("promotions", promotionSchema);

export default promotionsModel;
