import {productsModel} from "../models/products.js";
import {ordersModel} from "../models/orders.js";


const adminProductsController = {
    async getProductById(req, res) {
        try {
            const { id } = req.params;
            const product = await productsModel.findOne({id: id});
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (err) {
            console.log(err);
            res.status(502).json({ err });
        }
    },
    async getAllOrders(req, res) {
        try {
            const orders = await ordersModel.find().populate('cartId');
            res.json(orders);
        } catch (err) {
            console.log(err);
            res.status(500).json({err});
        }
    },

    async getOrderById(req, res) {
        const {id} = req.params;

        try {
            const order = await ordersModel.findById(id).populate('cartId');
            if (!order) {
                return res.status(404).json({error: "Order not found"});
            }
            res.json(order);
        } catch (err) {
            console.log(err);
            res.status(500).json({error: "Server error"});
        }
    }
};

export default adminProductsController;
