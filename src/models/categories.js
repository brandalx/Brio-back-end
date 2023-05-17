import mongoose from "mongoose";

let schema = new mongoose.Schema({
  _id: String,
  categoryName: String,
  itemsId: Array,
});
export const categoriesModel = mongoose.model("categories", schema);

//todo: correct model according on future requests (in future releases)
