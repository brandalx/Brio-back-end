import mongoose from "mongoose";

let schema = new mongoose.Schema({
  title: String,
  desc: String,
  tags: Array,
  userRef: String,
  cover: String,
  content: Object, // Draft.js output
});
export const blogsModel = mongoose.model("blogs", schema);

//todo: correct model according on future requests (in future releases)
