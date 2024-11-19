import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    
        longDescription: {
            type:Array,
            required: true,
            
    },
    reviews:{
        type:Array,
        default:[]
    },
    quantity: {
        type: Number,
        required: true,
    },
});
const Product = mongoose.model("Product", ProductSchema);
export default Product;