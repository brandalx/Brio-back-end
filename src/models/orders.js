import mongoose from "mongoose";

let schema = new mongoose.Schema({
  cart_id: Number,
  status: String,
  customer: [
    {
      firstname: String,
      lastname: String,
    },
  ],
  delivery: [
    {
      country: String,
      state: String,
      city: String,
      address1: String,
      address2: String,
    },
  ],
});
export const ordersModel = mongoose.model("orders", schema);

//todo: correct model according on future requests (in future releases)
