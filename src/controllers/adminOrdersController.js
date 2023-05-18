import { ordersModel } from "../models/orders.js";
const adminOrdersController = {
    async getAllOrders(req, res) {
        try {
            const orders = await ordersModel.find().populate("_id");
            res.json(orders);
        } catch (err) {
            console.log(err);
            res.status(500).json({ err });
        }
    },

    async getOrderById(req, res) {
        const { id } = req.params;

        try {
            const order = await ordersModel.findById(id).populate("_id");
            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }
            res.json(order);
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: "Server error" });
        }
    },
};

export default adminOrdersController;
