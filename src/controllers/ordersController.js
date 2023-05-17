import { ordersModel } from "../models/orders.js";
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
};

export default ordersController;
