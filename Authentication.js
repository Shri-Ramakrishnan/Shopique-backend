const express = require("express");
const path = require("path");
const multer = require("multer"); 
const User = require("./models/userschema");

const router = express.Router();

// const UserSchema = new mongoose.Schema({
//   username: String,
//   email: String,
//   password: String,
//   mobile: { type: String, required: true },
//   address: { type: String, required: true },
//   image: { type: String, default: '' },
// });

// const User = mongoose.model("users", UserSchema);

router.post("/signup", async (req, res) => {
  const { username, email, password, mobile, address, image } = req.body;
  console.log(req.body);

  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const newUser = new User({
      username,
      email,
      password,
      mobile,
      address,
      image,
    });

    await newUser.save();
    console.log("Signup success");
    res.status(201).json({ success: true, message: "Signup successful!" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again." });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid user" });
    }

    if (user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    console.log("Login success");
    if(user.email == "shriram@gmail.com"){
      res.status(200).json({ success: true, message: "Login successful!",user : user, role: "Admin"});
    }else{
    res.status(200).json({ success: true, message: "Login successful!",user : user, role: "User"});
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "An error occurred. Please try again." });
  }
});


// fetch User details
router.get("/fetch/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({"_id" : userId});

    console.log("User Name : ",user.username)
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User fetched successfully", data: user});
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error });
  }
});



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/users/"); // Folder for mobile images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage: storage });

router.use("/uploads/users/", express.static("uploads/users"));

router.put('/update/:userId', upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, email, password, mobile, address } = req.body;
    console.log(req.body);

    // Find the user by ID
    const user = await User.findById(userId);
    console.log("user found");
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user data
    if (name) user.username = name;
    if (email) user.email = email;
    if (password) user.password = password; 
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;

    if (req.file) {
      user.image = `/uploads/users/${req.file.filename}`;// Store the image path
    }

    // Save the updated user
    const updatedUser = await user.save();
    console.log("updated");
    
    res.status(200).json({
      message: 'User details updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user details' });
  }
});




module.exports = router;
