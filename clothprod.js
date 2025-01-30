const express = require("express");
const multer = require("multer"); 
const path = require("path");
const mongoose = require("mongoose");
const {mobile, cloth, homeappliances} = require("./models/products")

const router = express.Router();

// Product Schema
// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true }, 
//   price: { type: Number, required: true }, 
//   brand: { type: String }, 
//   image: { type: String }, 
//   rating: { type: Number, default: 0 },
//   description: { type: String, required: true },
//   stock: { type: Number, required: true },
//   route: { type: String },
//   category: { type: String, required: true }, 
//   deliverytime: { type: String },
//  },
//  { timestamps: true },
// );

// const Product = mongoose.model("clothingproduct", productSchema);

// Multer Storage for cloths
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/clothings/"); // Folder for mobile images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

// Serve cloth Images
router.use("/uploads/clothings/", express.static("uploads/clothings"));

// Add cloth Product
router.post("/prod", upload.single("image"), async (req, res) => {
  try {
    
    const { name, price, brand, rating, description, stock, route, category, deliverytime } = req.body;
    const imagePath = req.file ? `/uploads/clothings/${req.file.filename}` : null;

    const newProduct = new cloth({
      name,
      price,
      brand,
      image: imagePath , 
      rating,
      description,
      stock,
      route,
      category,
      deliverytime,

    });

    await newProduct.save();

    res.status(201).json({ message: "cloth product added successfully" });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Failed to add cloth product" });
  }
});

// Fetch cloth Products
router.get("/fetch", async (req, res) => {
  try {
    const products = await cloth.find(); // Fetch all products
    res.status(200).json(products);
    
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Search cloth Products
router.get("/search", async (req, res) => {
  const query = req.query.query;
  try {
    const products = await cloth.find({
      name: { $regex: query, $options: "i" },
    }).limit(10); // Limit to 10 results
 
    res.json(products);
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).send("Error searching products");
  }
});

// Delete cloth Product
router.delete("/:_id", async (req, res) => {
  try {
    const productId = req.params._id;
    const result = await cloth.deleteOne({ name: productId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error });
  }
});


router.put("/update/:_id", upload.single("image"), async (req, res) => {
  const { _id } = req.params;
  const { name, price, brand, rating, description, stock, route, category, deliverytime, image } = req.body;

  try {
    const updateFields = {
      name,
      price,
      brand,
      image,
      rating,
      description,
      stock,
      route,
      category,
      deliverytime,
    };

    if (req.file) {
      updateFields.image = `/uploads/clothings/${req.file.filename}`;
    }
    const updatedProduct = await cloth.findOneAndUpdate(
      { _id },
      { $set: { ...updateFields, updatedAt: Date.now() } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Failed to update product" });
  }
});

module.exports = router;
