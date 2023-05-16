import {ordersModel} from "../models/orders.js";

const adminOrdersController = {
    async getAllOrders(req, res) {
        try {
            const orders = await ordersModel.find().populate('cartId');
            res.json(orders);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    }
};

export default adminOrdersController;
