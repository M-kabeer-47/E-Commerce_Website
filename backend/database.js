import mongoose from "mongoose";
import Product from "./Models/Products.js";
import User from "./Models/User.js";
import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import Order from "./Models/Orders.js";
dotenv.config({path:".env"});
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});
const upload_on_cloudinary = async (file_path)=>{
if(!file_path){
    return null
}
else{
    try{
        let response = await cloudinary.uploader.upload(file_path)
        
        
        return response.secure_url;
    }
    catch(err){
        console.log(err)
    }
}
}
 const uri = "mongodb+srv://User1:byoabD1X2y7KzU2I@e-commerce.kopglez.mongodb.net/E-Commerce";
 async function Query(){
    console.log("Api Key: "+process.env.CLOUD_API_KEY);
    await mongoose.connect(uri)
    console.log("Connected to Database");
    await Order.updateMany({},{$set:{status:"Processing"}});
     }
Query()

