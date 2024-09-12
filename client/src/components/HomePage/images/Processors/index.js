import { ServerApiVersion, MongoClient } from 'mongodb';

const uri = "mongodb+srv://User1:byoabD1X2y7KzU2I@e-commerce.kopglez.mongodb.net/";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the MongoDB server
    await client.connect();
    
    // Access the default database provided in the URI
    const database = client.db("E-Commerce");
    
    // Access the "processors" collection
    const collection = database.collection("Playstation");
    await collection.insertMany([
      {
        name: "PlayStation 5 Console",
        price: "PKR 120,000",
        category: "Playstation",
        rating: 4.9,
        description: "The latest PlayStation 5 console with ultra-high-speed SSD and 3D audio.",
        imageUrl: "./images/playstation.png",
        longDescription: [
          "Ultra-high-speed SSD",
          "Ray tracing",
          "4K-TV gaming",
          "Up to 120fps with 120Hz output",
          "HDR technology",
          "Tempest 3D AudioTech"
        ],
        quantity: 500
      },
      {
        name: "PlayStation 4 Pro",
        price: "PKR 70,000",
        category: "Playstation",
        rating: 4.7,
        description: "Enhanced PS4 console with 4K gaming and entertainment.",
        imageUrl: "./images/playstation2.png",
        longDescription: [
          "4K-TV gaming",
          "4K entertainment streaming",
          "HDR technology",
          "Faster frame rates",
          "1TB storage",
          "DualShock 4 wireless controller"
        ],
        quantity: 500
      },
      {
        name: "PlayStation VR",
        price: "PKR 45,000",
        category: "Playstation",
        rating: 4.6,
        description: "Virtual reality headset for PlayStation with immersive experiences.",
        imageUrl: "./images/playstation3.png",
        longDescription: [
          "Advanced VR display",
          "3D audio technology",
          "Built-in mic",
          "Compatible with DualShock 4 and PS Move controllers",
          "VR games and experiences",
          "120fps support"
        ],
        quantity: 500
      },
      {
        name: "DualSense Wireless Controller",
        price: "PKR 12,000",
        category: "Playstation",
        rating: 4.8,
        description: "Next-generation PlayStation 5 controller with haptic feedback and adaptive triggers.",
        imageUrl: "./images/dualsense.png",
        longDescription: [
          "Haptic feedback",
          "Adaptive triggers",
          "Built-in microphone",
          "Signature comfort",
          "Create button",
          "Wireless connectivity"
        ],
        quantity: 500
      },
      {
        name: "PlayStation 4 Slim",
        price: "PKR 60,000",
        category: "Playstation",
        rating: 4.6,
        description: "Sleek and lightweight PS4 console with HDR support.",
        imageUrl: "./images/playstation4.png",
        longDescription: [
          "HDR technology",
          "1TB storage",
          "Compact design",
          "DualShock 4 wireless controller",
          "Blu-ray Disc playback",
          "Wireless connectivity"
        ],
        quantity: 500
      },
      {
        name: "PlayStation Plus Membership",
        price: "PKR 6,000",
        category: "Playstation",
        rating: 4.7,
        description: "12-month membership providing online multiplayer and free monthly games.",
        imageUrl: "./images/playstation5.png",
        longDescription: [
          "Online multiplayer",
          "Free monthly games",
          "Exclusive discounts",
          "Cloud storage",
          "Share Play",
          "PlayStation Plus Collection"
        ],
        quantity: 500
      },
      {
        name: "PlayStation Camera",
        price: "PKR 8,000",
        category: "Playstation",
        rating: 4.4,
        description: "Camera accessory for PlayStation 4 with facial recognition and voice commands.",
        imageUrl: "./images/playstation6.png",
        longDescription: [
          "Facial recognition",
          "Voice commands",
          "Broadcast yourself",
          "Dual lenses",
          "Four-channel microphone array",
          "Compatible with PlayStation VR"
        ],
        quantity: 500
      },
      {
        name: "PlayStation Move Motion Controllers",
        price: "PKR 10,000",
        category: "Playstation",
        rating: 4.5,
        description: "Motion controllers for PlayStation VR for intuitive gaming experiences.",
        imageUrl: "./images/playstation7.png",
        longDescription: [
          "Precise motion tracking",
          "Intuitive gaming experience",
          "Ergonomic design",
          "Rechargeable battery",
          "Built-in vibration feedback",
          "Compatible with PlayStation VR"
        ],
        quantity: 500
      },
      {
        name: "PlayStation 5 HD Camera",
        price: "PKR 15,000",
        category: "Playstation",
        rating: 4.6,
        description: "HD camera for PlayStation 5 with dual lenses for broadcasting and streaming.",
        imageUrl: "./images/playstation8.png",
        longDescription: [
          "1080p capture",
          "Background removal tools",
          "Dual lenses",
          "Built-in stand",
          "Broadcast and stream",
          "Compatible with PlayStation 5"
        ],
        quantity: 500
      },
      {
        name: "PlayStation Media Remote",
        price: "PKR 5,000",
        category: "Playstation",
        rating: 4.3,
        description: "Media remote for PlayStation 5 for easy media control.",
        imageUrl: "./images/playstation9.png",
        longDescription: [
          "Seamless console compatibility",
          "Media playback controls",
          "TV settings adjustment",
          "Easy setup",
          "Compact design",
          "Voice control"
        ],
        quantity: 500
      }
    ]
    
    )
    // Insert a document into the collection
  
    console.log("Document inserted successfully.");
    
    console.log("Connected to MongoDB and inserted a document into 'processors' collection.");
  } finally {
    // Close the connection
    await client.close();
  }
}

run().catch(console.dir);
