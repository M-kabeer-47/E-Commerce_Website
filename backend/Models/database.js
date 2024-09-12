import mongoose from 'mongoose';
import User from './User.js';
import products from './Products.js';
// MongoDB connection URI
const uri = "mongodb+srv://User1:byoabD1X2y7KzU2I@e-commerce.kopglez.mongodb.net/E-Commerce";
const giftCards = [
  {
    name: "Amazon Gift Card",
    price: "PKR 10,000",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-1.png",
    description: "Amazon Gift Card worth PKR 10000",
    rating: 4.9,
    longDescription: [
      "Valid for any purchase on Amazon.",
      "Can be used for products, services, and more.",
      "Instant email delivery."
    ],
    quantity: 50
  },
  {
    name: "iTunes Gift Card",
    price: "PKR 5000",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-2.png",
    description: "iTunes Gift Card worth PKR 5000",
    rating: 4.8,
    longDescription: [
      "Ideal for music, apps, and more from the iTunes store.",
      "No expiry date.",
      "Delivered via email."
    ],
    quantity: 50
  },
  {
    name: "Google Play Gift Card",
    price: "PKR 7000",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-3.png",
    description: "Google Play Gift Card worth PKR 7000",
    rating: 4.7,
    longDescription: [
      "Use for apps, games, movies, and more from the Google Play store.",
      "No expiration and no fees.",
      "Delivered instantly via email."
    ],
    quantity: 50
  },
  {
    name: "Netflix Gift Card",
    price: "PKR 3000",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-4.png",
    description: "Netflix Gift Card worth PKR 3000",
    rating: 4.9,
    longDescription: [
      "Redeem for Netflix subscription.",
      "Works for both new and existing accounts.",
      "Instant email delivery."
    ],
    quantity: 50
  },
  {
    name: "Steam Gift Card",
    price: "PKR 8000",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-5.png",
    description: "Steam Gift Card worth PKR 8000",
    rating: 4.6,
    longDescription: [
      "Perfect for buying games and other content on Steam.",
      "No expiry date.",
      "Delivered instantly to your inbox."
    ],
    quantity: 50
  },
  {
    name: "PlayStation Gift Card",
    price: "PKR 7200",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-6.png",
    description: "PlayStation Gift Card worth PKR 6000",
    rating: 4.8,
    longDescription: [
      "Use for games, add-ons, and more on the PlayStation Store.",
      "No expiration.",
      "Instant email delivery."
    ],
    quantity: 50
  },
  {
    name: "Xbox Gift Card",
    price: "PKR 6500",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-7.png",
    description: "Xbox Gift Card worth PKR 5500",
    rating: 4.7,
    longDescription: [
      "Buy games, movies, and apps on the Microsoft Store.",
      "No expiration date.",
      "Instant delivery via email."
    ],
    quantity: 50
  },
  {
    name: "Spotify Gift Card",
    price: "PKR 3200",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-8.png",
    description: "Spotify Gift Card worth PKR 2000",
    rating: 4.6,
    longDescription: [
      "Redeem for Spotify Premium subscription.",
      "No expiration date.",
      "Instant email delivery."
    ],
    quantity: 50
  },
  {
    name: "PlayStation Gift Card",
    price: "PKR 7200",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-11.png",
    description: "PlayStation Gift Card worth PKR 6000",
    rating: 4.8,
    longDescription: [
      "Use for games, add-ons, and more on the PlayStation Store.",
      "No expiration.",
      "Instant email delivery."
    ],
    quantity: 50
  },
  {
    name: "Steam Gift Card",
    price: "PKR 9200",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-9.png",
    description: "Steam Gift Card worth PKR 8000",
    rating: 4.6,
    longDescription: [
      "Perfect for buying games and other content on Steam.",
      "No expiry date.",
      "Delivered instantly to your inbox."
    ],
    quantity: 50
  },
  {
    name: "Fortnite Vbucks",
    price: "PKR 2600",
    category: "Gift Cards",
    url: "gift-cards",
    imageUrl: "images/gift-card-10.png",
    description: "Fortnite Vbucks gift card worth PKR 2600 ",
    rating: 2.9,
    longDescription: [
      "V-Bucks can be used to buy skins, emotes, and Battle Passes in Fortnite.",
    "Redeemable on all platforms including PlayStation, Xbox, and PC.",
    "Instant email delivery, no expiration."
    ],
    quantity: 50
  }
];


  
  
  
  
// Connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
      await mongoose.connect(uri);
  
  
    console.log("Connected to MongoDB");
    // const collection = mongoose.connection.collection('products');
    // const pr= await collection.find({}).toArray();
    try{
      await products.updateOne({name: "Fortnite Vbucks"},{
        $set: {
          imageUrl: "images/gift-card-10.png"
        }
      })
      console.log("done");
    }
    catch(err){
      console.log(err);
    }

    
    
    

    

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

connectDB();
