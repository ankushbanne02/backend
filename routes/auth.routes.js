const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();



const User = require("../models/user.model");
const UserProfile = require("../models/UserProfile");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, mobile, email, password } = req.body;
  if (!name || !mobile || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, mobile, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ message: "User already exists" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ message: "Login successful", token });
});

module.exports = router;



router.post("/profile", async (req, res) => {
    try {
        const { age, annualIncome, monthlyIncome, rentExpense, foodExpense, miscellaneousExpense } = req.body;

        const newUserProfile = new UserProfile({
            age,
            annualIncome,
            monthlyIncome,
            rentExpense,
            foodExpense,
            miscellaneousExpense
        });

        await newUserProfile.save();
        res.status(201).json({ message: "Profile created successfully", data: newUserProfile });
    } catch (error) {
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

// Get All Profiles
router.get("/profiles", async (req, res) => {
    try {
        const profiles = await UserProfile.find();
        res.status(200).json(profiles);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});