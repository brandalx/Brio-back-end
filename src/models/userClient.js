import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userClientSchema = new mongoose.Schema({
  firstname: String,
  lastname: String,
  email: {
    type: String,
    unique: true,
  },
  birthdate: Date,

  nickname: {
    type: String,
    unique: true,
  },
  avatar: String,
  password: String,

  cart: {
    type: [
      {
        productId: String,
        productAmount: Number,
      },
    ],
  },
  comments: [
    {
      commentRef: String,
      restaurantRef: String,
      datecreated: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  rate: [
    {
      blogId: Number,
      rating: Number,
    },
  ],
  address: [
    {
      country: String,
      state: String,
      city: String,
      address1: String,
      address2: String,
    },
  ],
  creditdata: [
    {
      paymentMethod: {
        type: String,
        default: "Credit Card",
      },
      cardNumber: String,
      expirationDate: String,
      securityCode: String,
      cardType: {
        type: String,
        default: "visa",
      },
      cardholder: String,
    },
  ],
  orders: [
    {
      userRef: String,
      orderId: String,
      restaurant: [String],
      creationDate: Date,
      paymentSummary: Object,
      orderRef: String,
    },
  ],

  role: {
    type: String,
    default: "USER",
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurants",
    // required: function () {
    //   return this.role === "ADMIN";
    // },
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
  notes: String,
});

export const UserClientModel = mongoose.model("users", userClientSchema);

//todo: correct model according on future requests (in future releases)
