import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import products from "./Models/Products.js"; 
import Users from "./Models/User.js";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

import stream from "stream";
dotenv.config();
import {v2 as cloudinary} from 'cloudinary';




const uri = "mongodb+srv://User1:byoabD1X2y7KzU2I@e-commerce.kopglez.mongodb.net/E-Commerce";
import bcrypt from "bcrypt";
import passport from "passport";
import cookieParser from "cookie-parser"; 
import google from "./Authentication/google.js";
import Order from "./Models/Orders.js";
import upload from "./middlewares/multer.js";
import { log } from "console";



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    
  }
};


connectDB();


async function fetchCategory(category,page) {
  try {
    
    const pr = await products.find({ url: category });
    if (pr.length === 0) {
      console.log("No products found in the given category");
      return false;
    } else {
      let start = (page - 1) * 9;
      if(start>= pr.length){
        return []
      }
      let end = page * 9;
      if(end>= pr.length){
        end = pr.length;
      }
      let Category = pr.slice(start,end);
      return Category;
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    return false;
  }
}


async function fetchProduct(id) {
  try {
    const product = await products.findById(id); 
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}





const app = express();
app.use(
  cors({
    origin:"https://e-commerce-website-cck4.vercel.app",
    credentials: true, 
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(express.json());
 


app.use(passport.initialize());
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
app.get("/stripePublishableKey",authenticateUser, (req, res) => {
  
  res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
}
);
app.post("/create-payment-intent",authenticateUser, async (req, res) => {
  try {
    let {amount} = req.body;
    
    console.log("Amount: ", amount);
    
    console.log(process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 500,
      currency: "usd",  
      payment_method_types: ["card"],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error("Error creating payment intent:", err);
    res.status(500).send({ error: err.message });
  }
});


app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await fetchProduct(id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the product." });
  }
});

app.get("/products/:category", async (req, res) => {
  try{

  
  const { category } = req.params;
  const {page} = req.query || 1;
  console.log("Inside Products: "+page+" "+category);
  

  const categoryObject = await fetchCategory(category,page);
  
  if (categoryObject === false) {
    res.json({ error: "Category not found." });
  } else {
    res.json(categoryObject);
  }
}
catch(err){
  console.log(err);
  res.status(500).json({ error: "An error occurred while fetching the category." });
}
}
);


app.get("/search/:text", async (req, res) => {
  const { text } = req.params;
  const { page } = req.query;
  console.log("inside search: " +page);
  try {
    const results = await products.find({
      $or: [
        { name: { $regex: `.*${text}.*`, $options: "i" } },
        { category: { $regex: `.*${text}.*`, $options: "i" } }
      ]
    });
    
    if (results.length === 0) {
      res.send(false);
    } else {
      let total_pages = Math.ceil(results.length/9);
      let start = (page - 1) * 9;
      if(start>= results.length){
        return []
      }
      let end = page * 9;
      if(end>= results.length){
        end = results.length;
      }
      let searchResults = results.slice(start,end);
      res.json({searchResults:searchResults,total_pages:total_pages});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post("/checkEmail",async(req,res)=>{
  try{

  
  const {email} = req.body;
  log
  const user = await Users.findOne({email:email});
  console.log(user);
  if(user){
    if(user.platform === "Google"){
      res.send({data:user.platform});
    }
    else{
      res.send(true);
    }
  }
  else{
    console.log("User Does Not Exist");
    res.send(false);
  }
}
catch(err){
  console.log(err);
  res.send("Error Checking Email");
} 
})
app.post("/register",async(req,res)=>{
  let saltRounds = 10;
  console.log("Register Route");
  console.log(req.body);
  const {User} = req.body;
  
  
    try{
      console.log("Creating User");
      
      const salt = await bcrypt.genSalt(saltRounds);
    
      // Hash the password with the salt
      const hashedPassword = await bcrypt.hash(User.password, salt);
      User.password = hashedPassword;
      await Users.create(User);
    }
    catch(err){
      console.log(err);
      res.send("Error Creating User");
    }
  
  
  
  

  
  res.send("Success");
})
// hELLO
app.post("/login",async(req,res)=>{
  console.log("Login Route");
  console.log(req.body);
  try{

  
  let {email,password} = req.body;
  email = email.toLowerCase();
  if(!await Users.exists({email:email})){
    console.log("User Does Not Exist");
    res.status(404).json("User Does Not Exist");

  }
  else{
    const user = await Users.findOne({email:email});  
    if(user.platform === "Google"){
      console.log("Google User");
      res.send({data:user.platform});
      return;
    }
    else if(await bcrypt.compare(password,user.password)){
      console.log("Login Susccess");
      const token = jwt.sign({
      
        email:user.email,
        
      },process.env.JWT_SECRET);
      console.log(token);
      res.json( {token: token,
        maxAge: 2 * 24 * 60 * 60 * 1000+Date.now(),data:"Success"});
    
      
        
      
    }
    
    else{
      console.log("Incorrect Password");
      res.status(400).json("Incorrect Password");
    }
  }
}
catch(err){
  console.log(err);
  res.send(err);
}
}
)
async function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or malformed authorization header' });
  }

  
  const token = authHeader.split(' ')[1];
  
  

 
  try {
    
    
    const user = jwt.verify(token, process.env.JWT_SECRET);
    
    
    const person = await Users.findOne({email : user.email});
    
    
    req.user = person; 
    

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
app.get("/user",authenticateUser,async(req,res)=>{
 
  
  
  res.send(req.user);

})
app.get("/auth/google",passport.authenticate("google",{  
  session:false,
  scope: ["profile","email"],
  
})) 
app.get("/auth/google/callback",passport.authenticate("google",{
session:false,
failureRedirect:"https://e-commerce-website-cck4.vercel.app/login",
  

}),function (req,res){
  console.log("Google Callback Route");
  
  const token = req.user.token;
    let maxAge= 2 * 24 * 60 * 60 * 1000+Date.now();

  res.redirect(`https://e-commerce-website-cck4.vercel.app?token=${token}&maxAge=${maxAge}`);

})
function findProductIndex(cart,imageUrl){
  for(let i = 0;i<cart.length;i++){
    if(cart[i].imageUrl === imageUrl){
      return i;
    }
  }
  return -1;
}

app.get("/cart",authenticateUser,async(req,res)=>{
  try{

  
  let cart = req.user.cart;
  for(let i = 0;i<cart.length;i++){
    let product = await products.findById(cart[i]._id);
    cart[i].quantity = product._doc.quantity;
  }
  res.send(cart);
}
catch(err){
  console.log(err);
  res.send("Error Fetching Cart");
}
})
app.post("/addToCart/:id",authenticateUser,async(req,res)=>{
  
  try{

  
let product = await products.findById(req.params.id);
console.log("Fetched Product"+product);

const {quantity} = req.body;
console.log("Quantity"+quantity);








const index = findProductIndex(req.user.cart,product.imageUrl);
const cart = req.user.cart;

console.log(cart.some((item)=>item.imageUrl === product.imageUrl));
if(cart.some((item)=>item.imageUrl === product.imageUrl)){
  console.log("Product Already Exists");
  
  
  
  
  cart[index].quantityInCart += quantity;
  res.send("Product Already Exists in Cart");
}
else{
  let product = await products.findById(req.params.id);


let productInCart = {...product._doc,
 quantityInCart:quantity
}


  cart.push(productInCart);
  res.send("Successfully Added to Cart");
}
console.log(cart);


await Users.updateOne({email:req.user.email},{cart:cart});

  }
  catch(err){
    console.log(err);
    res.send("Erorr Adding to Cart");
  }
}

)
  
app.post("/emptyCart",authenticateUser,async(req,res)=>{
  console.log("Empty Cart Route");
  try{
    await Users.updateOne({email:req.user.email},{cart:[]});
  res.send("Success");
  }
  catch(err){
    console.log(err);
    res.send("Error Emptying Cart");
  }
  
})
app.post("/admin_order",authenticateUser,async(req,res)=>{
    try{
      let {order_for_admin} = req.body;
      order_for_admin = {
        ...order_for_admin,
        customer_email:req.user.email,
      }
      console.log(order_for_admin);
      
      let response = await Order.create(order_for_admin);
      console.log(response)
      
      res.status(200).json({message:"Oder confirmed",id:response._id});
    }
    catch(err){
      res.status(400).json({message:"Fatal error"})
    }
}
)
app.put("/increment/:id",authenticateUser,async(req,res)=>{
  
  console.log(req.body);
  try{

  
  const {quantity} = req.body;
  
  
  const product = await products.findById(req.params.id);
  const index = findProductIndex(req.user.cart,product.imageUrl);
  const cart = req.user.cart;
  cart[index].quantityInCart+=quantity;
  await Users.updateOne({email:req.user.email},{cart:cart});
  res.send("Success");
  }
  catch(err){
    console.log(err);
    res.send("Error Incrementing Quantity");
  }

}

)
app.get("/featuredProducts",async(req,res)=>{
  console.log("Featured Products Route");
  try{
  const featuredProducts = await products.find({})
  let featured = [];
  let variable = 3
  for(let i = 0;i<8;i++){
    let index = variable+i;
    featured.push(featuredProducts[index]);
    variable+=5;
  }
  res.send(featured);
}
catch(err){
  console.log(err);
  res.send("Error Fetching Featured Products");
}
})

  

app.put("/decrement/:id",authenticateUser,async(req,res)=>{
  try{
  console.log("Decrement Route");
  console.log(req.body);
  const {quantity} = req.body;
  console.log(req.params.id);
  
  const product = await products.findById(req.params.id);
  const index = findProductIndex(req.user.cart,product.imageUrl);
  const cart = req.user.cart;
  cart[index].quantityInCart-=quantity;
  
  
  await Users.updateOne({email:req.user.email},{cart:cart});
  res.send("Success");
  }
  catch(err){
    console.log(err);
    res.send("Error Decrementing Quantity");
  }


}
)
app.put("/remove/:id",authenticateUser,async(req,res)=>{
  try{
  console.log("Remove Route");
  console.log(req.params.id);
  const product = await products.findById(req.params.id);
  const index = findProductIndex(req.user.cart,product.imageUrl);
  const cart = req.user.cart;
  cart.splice(index,1);
  await Users.updateOne({email:req.user.email},{cart:cart});
  res.send("Success");
  }
  catch(err){
    console.log(err);
    res.send("Error Removing Product");
  }
})
app.post("/addToWishlist",authenticateUser,async(req,res)=>{
  try{
  console.log("Add to Wishlist Route");
  let {productId} = req.body;

  const product = await products.findById(productId);
  const wishlist = req.user.wishlist;
  if(wishlist.some((item)=>item.imageUrl === product.imageUrl)){
    
    res.send("Product Already Exists in Wishlist");
    return;
  }
  else{
    wishlist.push(product);
  }
  await Users.updateOne({email:req.user.email},{wishlist:wishlist});
  res.send("Success");
}
catch(err){
  console.log(err);
  res.send("Error Adding to Wishlist");
}
})
app.get("/wishlist",authenticateUser,async(req,res)=>{
  try{
  console.log("Wishlist Route");
  let wishlist = req.user.wishlist;
  for(let i = 0;i<wishlist.length;i++){
    let product = await products.findById(wishlist[i]._id);
    wishlist[i].quantity = product._doc.quantity;
  }
  res.send(wishlist);
}
catch(err){
  console.log(err);
  res.send("Error Fetching Wishlist");
}
})
app.put("/removeWishlist/:id",authenticateUser,async(req,res)=>{
  try{
  console.log("Remove Wishlist Route");
  console.log(req.params.id);
  const product = await products.findById(req.params.id);
  const index = findProductIndex(req.user.wishlist,product.imageUrl);
  const wishlist = req.user.wishlist;
  wishlist.splice(index,1);
  await Users.updateOne({email:req.user.email},{wishlist:wishlist});
  res.send("Success");
  }
  catch(err){
    console.log(err);
    res.send("Error Removing Product from Wishlist");
  }
})


app.post("/sendEmail",async(req,res)=>{
  try{
  console.log("Send Email Route");
  const {email,subject,message,name} = req.body;
  console.log(email);
  console.log(subject);
  console.log(message);
  console.log(name);
  
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  }) 
  const emailOptions = {
    from: {
      name: name,
      address:email
    },
    to: process.env.EMAIL,
    subject: subject,
    text: message
  }
  try{
    await transporter.sendMail(emailOptions);
    res.send("Success");
  }
  catch(err){
    console.log(err);
    res.send("Error Sending Email");
  }
  }
  catch(err){
    console.log(err);
    res.send("Error Sending Email");
  }

})
app.put("/orderHistory",authenticateUser,async(req,res)=>{
  try{
  console.log("Order History Route");
  
  const {order} = req.body;
  
  
  const orderHistory = req.user.orderHistory;
  orderHistory.push(order);
  await Users.updateOne({email:req.user.email},{orderHistory:orderHistory});
  res.send("Success");
  }
  catch(err){
    console.log(err);
    res.send("Error Adding to Order History");
  }
})
app.get("/orderHistory",authenticateUser,async(req,res)=>{
  try{

  
  console.log("Order History Route");
  
  let {page} = req.query;
  page = parseInt(page);
  const orderHistory = req.user.orderHistory;
  if(req.user.orderHistory.length === 0){
    res.send([]);
    return;
  }
  const start = (page - 1) * 3;
  const end = page * 3;
  const orders = orderHistory.slice(start,end);
  let orderDetails = [];
  for(let i = 0;i<orders.length;i++){
    const order = await Order.findById(orders[i]);
    orderDetails.push(order);
  }
  res.send(orderDetails);
}
  catch(err){
    console.log(err);
    res.send("Error Fetching Order History");
  }

})

app.put("/updateStocks",authenticateUser,async(req,res)=>{
  try{
  console.log("Update Stocks Route");
  const {order} = req.body;
  console.log(order);
  for(let i = 0;i<order.length;i++){
    console.log("Order id"+order[i]._id);
    
    const product = await products.findById(order[i]._id);
    console.log(product);
    
    let quantity = product.quantity ;
    console.log("Before Update"+quantity);
    
    quantity-=order[i].quantityInCart;
    console.log("After Update"+quantity);
    

    await products.updateOne({_id:order[i]._id},{quantity:quantity});
  }
  res.send("Success");
}
catch(err){
  console.log(err);
  res.send("Error Updating Stocks");
}
})
app.get("/quantityInCart",authenticateUser,async(req,res)=>{
  try{
  let {imageUrl} = req.query;
  console.log(imageUrl);
  
  let cart = req.user.cart;
  let product = cart.find(product=>product.imageUrl === imageUrl)
  if(!product){
    console.log("Product not found")
    res.json({quantityInCart:0});
  }
  else{
    res.json({quantityInCart:product.quantityInCart});
  }
 
  }
  catch(err){
    console.log(err);
    res.send("Error Fetching Quantity in Cart");
  }
}

)
app.get("/verifyPassword",authenticateUser,async(req,res)=>{
  try{
    
  
  console.log("Verify Password Route");
  
  let {password} = req.query;
  let isCorrect = await bcrypt.compare(password,req.user.password);
  console.log(isCorrect)
  res.send(isCorrect);
  }
  catch(err){
    console.log(err);
    res.send("Error Verifying Password");
  }

}
)
app.put("/updateUser",authenticateUser,async(req,res)=>{ 
  try{
  console.log("Update Profile Route");
  const {user} = req.body;
  
  if(user.hasOwnProperty("password")){
    console.log(user.password);
    
    let saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  console.log(user);
  
  
  await Users.updateOne({email:req.user.email},{...user});
  res.send("Success");
}
catch(err){
  console.log(err);
  res.send("Error Updating Profile");
}
} 
)
app.get("/getProductQuantity",async(req,res)=>{
  try{
  console.log("Get Product Quantity Route");
  const {productId} = req.query;
  const product = await products.findById(productId);
  
  
  res.json({quantity:product.quantity});
  }
  catch(err){
    console.log(err);
    res.send("Error Fetching Product Quantity");
  }
}
)
app.get("/verifyStock",authenticateUser,async(req,res)=>{
  try{
  let {order} = req.query;
  let outOfStock = false;
  let outOfStockProducts = [];
  for(let i=0;i<order.length;i++){
    let product = await products.findById(order[i]._id);
    if(product.quantity < order[i].quantityInCart){
      outOfStock = true;
      outOfStockProducts.push({name:product.name,quantity:product.quantity});
    }
  }
  res.json({
    status:outOfStock,
    products:outOfStockProducts
  });
}
catch(err){
  console.log(err);
  res.send("Error Verifying Stock");
}
})
app.get("/getOrder/:id",async(req,res)=>{
  try{
  let {id} = req.params;
  const order = await Order.findById(id);
  res.send(order);
}
catch(err){
  console.log(err);
  res.send("Error Fetching Order");
}
}
)
app.post("/reviews",authenticateUser,async(req,res)=>{
  try{
  console.log("Reviews Route");
  console.log(JSON.stringify(req.body)+ "Body");
  let {review} = req.body;
  console.log(review+ "Review");
  const product = await products.findById(review.productId);
  let reviews = product.reviews;
  reviews.push(review);
  await products.updateOne({_id:review.productId},{reviews:reviews});
  res.send("Success");
}
catch(err){
  console.log(err);
  res.send("Error Adding Review");
}
}
)
app.get("/reviews/:id",async(req,res)=>{
  try{
  console.log("Reviews Route");
  let {id} = req.params;
  const product = await products.findById(id);
  res.send(product.reviews);
}
catch(err){
  console.log(err);
  res.send("Error Fetching Reviews");
}
}
)

app.post('/uploadImages', upload.array('images', 10), async (req, res) => {
  try {
    console.log("API Key: " + process.env.CLOUD_API_KEY);
    

    let urls = [];

    // Loop over the uploaded files and upload them directly to Cloudinary
    for (const file of req.files) {
      let url = await upload_on_cloudinary(file);
      
      if (url) {
        console.log(url+"URL")  // Upload file directly to Cloudinary
        urls.push(url);
      }
    }

    console.log("URLs:", urls);
    res.status(200).json({ urls: urls });

  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
});

const upload_on_cloudinary = async (file) => {
  if (!file) {
    return null;
  } else {
    return new Promise((resolve, reject) => {
      // Create a buffer stream to pass the file buffer to Cloudinary
      const bufferStream = new stream.PassThrough();
      bufferStream.end(file.buffer); // End the stream with file data in the buffer

      // Use Cloudinary's upload_stream method and handle the callback properly
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',  // Automatically detect the file type (image, video, etc.)
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);  // Reject the promise if an error occurs
          }
          if (result) {
            console.log("Cloudinary upload success:", result);
            resolve(result.secure_url);  // Resolve the promise with the secure URL
          }
        }
      );

      // Pipe the buffer stream to Cloudinary's upload function
      bufferStream.pipe(uploadStream);
    });
  }
};
app.get("/api/products/search", async (req, res) => {
  let { query } = req.query;
  console.log("Query: "+query);
  
  if (!query) {
    return res.status(400).json({ message: 'Query is required' });
  }

  try {
    
    const filter = {
      $or: [
        { name: { $regex: query, $options: 'i' } },  // Case-insensitive search on name
        { category: { $regex: query, $options: 'i' } } // Case-insensitive search on category
      ]
    };
    const Products = await products.find(filter).limit(10);

    

    res.status(200).json(Products);
  } catch (error) {
    console.error('Error fetching search suggestions:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})
app.get("/", (req, res) => {
  res.send("Hello from the server");
}
);
app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});
export default app;


