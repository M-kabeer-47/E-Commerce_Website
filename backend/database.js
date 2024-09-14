import mongoose from "mongoose";
import Product from "./Models/Products.js";
import User from "./Models/User.js";
 const uri = "mongodb+srv://User1:byoabD1X2y7KzU2I@e-commerce.kopglez.mongodb.net/E-Commerce";
 async function Query(){
    await mongoose.connect(uri)
    await User.updateOne({email:"muhammadkabeer2003@gmail.com"},{
        $set:{
            "orderHistory": []
        }
    })
    console.log("Updated");
    
 }
Query()
