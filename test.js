const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const authRoutes = require("./Authentication");
const mobileRoutes = require("./mobileprod");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/mobiles", mobileRoutes);

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/Ecommerse")
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));



// const productSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
//   image: String,
//   stock: Number,
//   description: String,
//   route: String,
// });

// // Create the Product model
// const Product = mongoose.model("Product", productSchema);
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/api/mobiles", upload.single("image"), async (req, res) => {
//   try {
//     const { name, price, stock, description, route } = req.body;
//     const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

//     const newProduct = new Product({
//       name,
//       price,
//       stock,
//       description,
//       route,
//       image: imagePath,
//     });

//     await newProduct.save();

//     res.status(201).json({ message: "Product added successfully" });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ error: "Failed to add product" });
//   }
// });

// // Route to fetch all products
// app.get("/api/mobiles", async (req, res) => {
//   try {
//     const products = await Product.find(); // Fetch all products from MongoDB
//     res.status(200).json(products); // Send the products back to the client
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// app.get('/api/mobiles/search', async (req, res) => {
//   const query = req.query.query;

//   try {
//     // Find products that match the query (case-insensitive)
//     const products = await Product.find({
//       name: { $regex: query, $options: 'i' }, // Match products with names containing the query
//     }).limit(10); // Limit to 10 results

//     res.json(products); // Send matched products as the response
//   } catch (error) {
//     console.error('Error searching products:', error);
//     res.status(500).send('Error searching products');
//   }
// });


// app.delete("/api/products/:name", async (req, res) => {
//   try {
//     const productName = req.params.name;
//     const result = await Product.deleteOne({ name: productName }); // Replace 'name' with '_id' if needed
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to delete product", error });
//   }
// });



// app.post("/api/clothings", upload.single("image"), async (req, res) => {
//   try {
//     const { name, price, stock, description, route } = req.body;
//     const imagePath = req.file ? `/clothings/${req.file.filename}` : null;

//     const newProduct = new Product({
//       name,
//       price,
//       stock,
//       description,
//       route,
//       image: imagePath,
//     });

//     await newProduct.save();

//     res.status(201).json({ message: "Product added successfully" });
//   } catch (error) {
//     console.error("Error adding product:", error);
//     res.status(500).json({ error: "Failed to add product" });
//   }
// });


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
