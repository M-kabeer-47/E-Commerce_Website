import mongoose from "mongoose";
import Product from "./Models/Products.js";
 const uri = "mongodb+srv://User1:byoabD1X2y7KzU2I@e-commerce.kopglez.mongodb.net/E-Commerce";
 async function Query(){
    await mongoose.connect(uri)
    await Product.updateMany({url:"rapid-deals"},[{
        $set:{
            price: {$replaceOne: {input: "$price", find: "PKR", replacement: "PKR "}}
        }
    }])
    console.log("Updated");
    
 }
Query()
