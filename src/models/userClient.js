import mongoose from "mongoose";

const userClientSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  email: {
    type: String,

    unique: true,
  },
  birthdate: {
    type: Date,
  },
  nickname: {
    type: String,
    unique: true,
  },
  avatar: String,
  password: {
    type: String,
  },
  cart: {
    type: [
      {
        productId: Number,
        productAmount: Number,
      },
    ],
  },
  comments: [
    {
      comment: String,
      date: Date,
    },
  ],
  rate: [
    {
      blogId: Number,
      rating: Number,
    },
  ],
  address: {
    country: String,
    state: String,
    city: String,
    address1: String,
    address2: String,
  },
  creditdata: {
    paymentMethod: String,
    cardNumber: String,
    expirationDate: String,
    securityCode: String,
  },
  orders: [
    {
      orderId: Number,
      restaurant: String,
      creationDate: Date,
      creationTime: String,
      status: {
        type: String,
        enum: ["placed", "prepared", "out", "delivered", "cancelled"],
      },
      totalAmount: Number,
      paymentSummary: {
        couponCode: String,
        tips: Number,
      },
    },
  ],
  role: {
    type: String,
    default: "USER",
  },
  favorites: [
    {
      restaurant: String,
      dishes: [Number],
    },
  ],
  phone: String,
  emailnotifications: Boolean,
  date_created: {
    type: Date,
    default: Date.now,
  },
});

export const UserClientModel = mongoose.model("users", userClientSchema);
