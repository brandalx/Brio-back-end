import { ordersModel } from "../models/orders.js";
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
    const id = req.params.id;

    try {
      let user = await UserClientModel.findOne({ _id: id });
      if (!user) {
        return res.status(401).json({ err: "User not found" });
      }

      // todo: pass auth middleware

      let validBodyClient = validateUserOrder(req.body);
      if (validBodyClient.error) {
        return res.status(400).json(validBodyClient.error.details);
      }

      const newOrder = {
        restaurant: req.body.restaurant,
        creationDate: new Date(),
        creationTime: new Date(),
        status: req.body.status,
        paymentSummary: req.body.paymentSummary,
      };

      user.orders.push(newOrder);

      await user.save();

      const createdOrder = user.orders[user.orders.length - 1];

      const orderId = createdOrder._id.toString(); // Convert objectId to string

      const lastOrderIndex = user.orders.length - 1;
      user.orders[lastOrderIndex].orderId = orderId;

      await user.save();

      console.log(user.orders);
      res.status(201).json({ msg: true });
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
};

export default ordersController;
