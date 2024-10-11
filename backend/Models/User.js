import mongoose from "mongoose";
import Orders from "./Orders.js";

    const userSchema = new mongoose.Schema({
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            
        },
        cart: {
            type: Array,
            default: [],   
        }
        ,wishlist: {
            type: Array,
            default: [],
        }
        ,
        platform:{
            default:"Local",
            type:String,
            required:true,
        },
        orderHistory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Orders',  // Reference to the 'Order' model
        }],
        
    });

// Create the User model
const User = mongoose.model("User", userSchema);

export default User;
