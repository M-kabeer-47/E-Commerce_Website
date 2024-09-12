import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import products from "./Products.js"; // Mongoose model for Products
import Users from "./User.js";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();




// MongoDB connection URI
const uri = "mongodb+srv://User1:byoabD1X2y7KzU2I@e-commerce.kopglez.mongodb.net/E-Commerce";
import bcrypt from "bcrypt";
import passport from "passport";
import cookieParser from "cookie-parser"; // Make sure you are using cookie-parser
import google from "./Authentication/google.js";
// import product from "../src/store/product.js";



// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

// Call this function once at the start of your server
connectDB();

// Fetch Category Function
async function fetchCategory(category,page) {
  try {
    // Assuming your `products` model is properly set up
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

// Fetch Product Function
async function fetchProduct(id) {
  try {
    const product = await products.findById(id); // Use Mongoose model to find by ID
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Express App Setup



const app = express();
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow credentials (cookies)
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(express.json());
app.use(cookieParser()); // Use cookie-parser to handle cookies


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
      currency: "usd",  // Use supported currency
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

  const { category } = req.params;
  const {page} = req.query || 1;
  console.log(page);

  const categoryObject = await fetchCategory(category,page);
  
  
  if (categoryObject === false) {
    res.status(404).json({ error: "Category not found." });
  } else {
    res.json(categoryObject);
  }
});

// Search Route (Using Mongoose Query)
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
      let start = (page - 1) * 9;
      if(start>= results.length){
        return []
      }
      let end = page * 9;
      if(end>= results.length){
        end = results.length;
      }
      let searchResults = results.slice(start,end);
      res.json(searchResults);
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred during search." });
  }
});
app.post("/checkEmail",async(req,res)=>{
  console.log("Check Email Route");
  console.log(req.body);
  const {email} = req.body;
  const user = await Users.findOne({email:email});
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
    }
  
  
  
  

  
  res.send("Success");
})
app.post("/login",async(req,res)=>{
  console.log("Login Route");
  console.log(req.body);
  const {email,password} = req.body;
  if(!await Users.exists({email:email})){
    console.log("User Does Not Exist");
    res.send("User Does Not Exist");

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
      res.cookie("uid",token,{
        maxAge: 2 * 24 * 60 * 60 * 1000
      });
      res.send("Success");
        
      
    }
    
    else{
      console.log("Incorrect Password");
      res.send("Incorrect Password");
    }
  }
}
)
async function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // Check if the Authorization header exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided or malformed authorization header' });
  }

  // Extract the token from the header
  const token = authHeader.split(' ')[1];
  
  

  // Verify the token
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
failureRedirect:"http://localhost:5173/login",
  

}),function (req,res){
  console.log("Google Callback Route");
  
  console.log(req.user.token.expiresIn);
  res.cookie("uid",req.user.token,{
    maxAge: 2 * 24 * 60 * 60 * 1000
  });
  res.redirect("http://localhost:5173/");

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
  
  let cart = req.user.cart;
  for(let i = 0;i<cart.length;i++){
    let product = await products.findById(cart[i]._id);
    cart[i].quantity = product._doc.quantity;
  }
  res.send(cart);
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
  await Users.updateOne({email:req.user.email},{cart:[]});
  res.send("Success");
})
app.put("/increment/:id",authenticateUser,async(req,res)=>{
  console.log("Increment Route");
  console.log(req.body);
  const {quantity} = req.body;
  console.log(req.params.id);
  
  const product = await products.findById(req.params.id);
  const index = findProductIndex(req.user.cart,product.imageUrl);
  const cart = req.user.cart;
  cart[index].quantityInCart+=quantity;
  await Users.updateOne({email:req.user.email},{cart:cart});
  res.send("Success");

}

)
app.get("/featuredProducts",async(req,res)=>{
  console.log("Featured Products Route");
  const featuredProducts = await products.find({})
  let featured = [];
  let variable = 3
  for(let i = 0;i<8;i++){
    let index = variable+i;
    featured.push(featuredProducts[index]);
    variable+=5;
  }
  res.send(featured);

})

  

app.put("/decrement/:id",authenticateUser,async(req,res)=>{
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
)
app.put("/remove/:id",authenticateUser,async(req,res)=>{
  console.log("Remove Route");
  console.log(req.params.id);
  const product = await products.findById(req.params.id);
  const index = findProductIndex(req.user.cart,product.imageUrl);
  const cart = req.user.cart;
  cart.splice(index,1);
  await Users.updateOne({email:req.user.email},{cart:cart});
  res.send("Success");
})
app.post("/addToWishlist",authenticateUser,async(req,res)=>{

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
})
app.get("/wishlist",authenticateUser,async(req,res)=>{
  console.log("Wishlist Route");
  let wishlist = req.user.wishlist;
  for(let i = 0;i<wishlist.length;i++){
    let product = await products.findById(wishlist[i]._id);
    wishlist[i].quantity = product._doc.quantity;
  }
  res.send(wishlist);
})
app.put("/removeWishlist/:id",authenticateUser,async(req,res)=>{
  console.log("Remove Wishlist Route");
  console.log(req.params.id);
  const product = await products.findById(req.params.id);
  const index = findProductIndex(req.user.wishlist,product.imageUrl);
  const wishlist = req.user.wishlist;
  wishlist.splice(index,1);
  await Users.updateOne({email:req.user.email},{wishlist:wishlist});
  res.send("Success");
})


app.post("/sendEmail",async(req,res)=>{
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

})
app.put("/orderHistory",authenticateUser,async(req,res)=>{
  console.log("Order History Route");
  
  const {order} = req.body;
  
  
  const orderHistory = req.user.orderHistory;
  orderHistory.push(order);
  await Users.updateOne({email:req.user.email},{orderHistory:orderHistory});
  res.send("Success");
  
})
app.get("/orderHistory",authenticateUser,async(req,res)=>{
  console.log("Order History Route");
  
  let {page} = req.query;
  page = parseInt(page);
  const orderHistory = req.user.orderHistory;
  const start = (page - 1) * 3;
  const end = page * 3;
  const orders = orderHistory.slice(start,end);
  res.send(orders);
})

app.put("/updateStocks",authenticateUser,async(req,res)=>{
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
})
app.get("/quantityInCart",authenticateUser,async(req,res)=>{
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

)
app.get("/verifyPassword",authenticateUser,async(req,res)=>{
  console.log("Verify Password Route");
  
  let {password} = req.query;
  let isCorrect = await bcrypt.compare(password,req.user.password);
  console.log(isCorrect)
  res.send(isCorrect);
}
)
app.put("/updateUser",authenticateUser,async(req,res)=>{ 
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
)
app.get("/getProductQuantity",async(req,res)=>{
  console.log("Get Product Quantity Route");
  const {productId} = req.query;
  const product = await products.findById(productId);
  
  
  res.json({quantity:product.quantity});
}
)
app.get("/verifyStock",authenticateUser,async(req,res)=>{
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
})
app.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});
