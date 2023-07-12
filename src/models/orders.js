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
    priceItem: {
      type: Number,
      required: true,
    },

    restaurantId: {
      type: String,
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
  userRef: {
    type: String,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

export const ordersModel = mongoose.model("orders", userOrderSchema);
