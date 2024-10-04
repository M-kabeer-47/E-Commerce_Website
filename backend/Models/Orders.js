import mongoose from "mongoose";

const Orders = new mongoose.Schema({
    total: {
        type: Number,
        required: true,
    },
    items: {
        type: Array,
        required: true,
    },
    customer_name: {
        type: String,
        required: true,
    },
    customer_email: {
        type: String,
        required: true,
    },
    customer_address: {
        type: String,
        required: true,
    },
    customer_phone: {
        type: String,
        required: true,
    },
    payment_method: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
})
const Order = mongoose.model("Order", Orders);
export default Order;


    
    


