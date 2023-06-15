import mongoose from "mongoose";

const promotionSchema = new mongoose.Schema({
  discountDetails: String,
  startDate: String,
  endDate: String,
  restaurantName: String,
  image: String,
  discountDays: Array,
});

const promotionsModel = mongoose.model("promotions", promotionSchema);

export default promotionsModel;
