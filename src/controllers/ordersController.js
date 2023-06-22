import { ordersModel } from "../models/orders.js";
import { productsModel } from "../models/products.js";
import { UserClientModel } from "../models/userClient.js";
import {
  validateOrder,
  validateUserOrder,
} from "../validation/ordersValidation.js";
const ordersController = {
  async getAllOrders(req, res) {
    try {
      let data = await ordersModel.find({});
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  async getOrdersById(req, res) {
    let idParams = req.params.id;

    try {
      let data = await ordersModel.findById({ _id: idParams });
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ error: "Order not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },

  async postOrder(req, res) {
    const id = req.tokenData._id;

    const orderBody = req.body.checkoutBodyData;
    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }
      //validating order body
      let validBodyClient = validateUserOrder(orderBody);
      if (validBodyClient.error) {
        return res.status(400).json(validBodyClient.error.details);
      }
      console.log(orderBody);

      if (!user.cart) {
        return res.status(404).json({ error: "Cart data not found" });
      }
      //validating order summary (in case if user will modify it in client)
      let productsArr = [];
      for (let item of user.cart) {
        console.log(item.productId);
        let product = await productsModel.findById(item.productId);
        if (product) {
          product.price = product.price * item.productAmount;

          productsArr.push(product);
        } else {
          productsArr.push(null);
        }
      }

      let presummary = productsArr.reduce((total, item) => {
        return (total += item ? item.price : 0);
      }, 0);
      let shipping = 5; //TODO: REPLACE IN RESTAURANT SHIPPING AMOUNT
      let tips = orderBody.userdata.paymentSummary.tips;
      let setPayment = {
        tips: tips,
        subtotal: presummary,
        shipping: presummary > 0 ? shipping : 0,
        totalAmount: shipping + presummary + tips,
      };
      console.log(setPayment);
      if (!setPayment) {
        return res.status(502).json({ error: false });
      }
      // updating summary from server data
      orderBody.userdata.paymentSummary.tips = setPayment.tips;
      orderBody.userdata.paymentSummary.subtotal = setPayment.subtotal;
      orderBody.userdata.paymentSummary.shipping = setPayment.shipping;
      orderBody.userdata.paymentSummary.totalAmount = setPayment.totalAmount;
      let newOrder = await new ordersModel(orderBody);
      newOrder.userRef = id;
      await newOrder.save();
      console.log(newOrder);
      let newOrderUser = {
        userRef: newOrder.userRef,
        restaurant: newOrder.ordersdata.restaurants,
        creationDate: newOrder.creationDate,
        paymentSummary: newOrder.userdata.paymentSummary,
        orderRef: newOrder._id,
      };
      user.orders.push(newOrderUser);
      await user.save();
      res.status(201).json({ msg: true });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
};

export default ordersController;
