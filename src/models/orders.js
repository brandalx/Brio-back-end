import mongoose from "mongoose";

let schema = new mongoose.Schema({
    id: String,
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Carts" },
    status: { type: String, enum: ['in_progress', 'success', 'canceled', 'waiting'] },
    customer: {
        firstname: String,
        lastname: String
    },
    delivery: {
        address: String
    }
});

export const ordersModel = mongoose.model("orders", schema);
