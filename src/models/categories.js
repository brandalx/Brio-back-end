import mongoose from "mongoose";

let schema = new mongoose.Schema({
  categoryName: String,
  restaurantId:String,
  itemsId: Array,
});
export const categoriesModel = mongoose.model("categories", schema);

//todo: correct model according on future requests (in future releases)
