import mongoose from "mongoose";

const paymentSummarySchema = new mongoose.Schema(
  {
    subtotal: {
      type: Number,
      required: true,
    },
    tips: {
      type: Number,
    },
    shipping: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const userOrderSchema = new mongoose.Schema({
  userdata: {
    selectedAddress: {
      type: String,
      required: true,
    },
    selectedPaymentMethod: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Placed"],
    },
    paymentSummary: {
      type: paymentSummarySchema,
      required: true,
    },
  },
  ordersdata: {
    products: {
      type: [productSchema],
      required: true,
    },
    restaurants: {
      type: [String],
      required: true,
    },
  },
});

export const ordersModel = mongoose.model("orders", userOrderSchema);
