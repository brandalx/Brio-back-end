import { UserClientModel } from "../models/userClient.js";

const usersController = {
  getUsers(req, res) {
    try {
      res.json({ message: "Users endpoint" });
    } catch (err) {
      console.log(err);
      res.status(502).json({ err });
    }
  },

  async getUserById(req, res) {
    let idParams = req.params.id;

    try {
      let data = await UserClientModel.findById({ _id: idParams });
      res.json(data);
    } catch (err) {
      console.log(err);
      return res.status(502).json({ err });
    }
  },
  async getUserCart(req, res) {
    let idParams = req.params.id;

    try {
      let user = await UserClientModel.findById(idParams);
      if (user) {
        let data = user.cart;
        res.json({ cart: data });
      } else {
        res.status(404).json({ error: "Cart data not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async getUserAddress(req, res) {
    let idParams = req.params.id;

    try {
      let user = await UserClientModel.findById(idParams);
      if (user) {
        let data = user.address;
        res.json({ cart: data });
      } else {
        res.status(404).json({ error: "Address data not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async getUserCreditData(req, res) {
    let idParams = req.params.id;

    try {
      let user = await UserClientModel.findById(idParams);
      if (user) {
        let data = user.creditdata;
        res.json({ creditdata: data });
      } else {
        res.status(404).json({ error: "Address data not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
  async getUserOrders(req, res) {
    let idParams = req.params.id;

    try {
      let user = await UserClientModel.findById(idParams);
      if (user) {
        let data = user.orders;
        res.json({ orders: data });
      } else {
        res.status(404).json({ error: "Orders data not found" });
      }
    } catch (err) {
      console.log(err);
      res.status(502).json({ error: err });
    }
  },
};
export default usersController;
