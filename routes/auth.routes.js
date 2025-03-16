const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/user.model");
const UserProfile = require("../models/UserProfile"); // Import the model correctly

const Transaction = require("../models/Transaction");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  // Check for missing fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({ name, email, password: hashedPassword });

    // Save the user
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

// Create User Profile
router.post("/profile", async (req, res) => {
  try {
    const { userId, age, annualIncome, monthlyIncome, rentExpense, foodExpense, miscellaneousExpense } = req.body;

    const newUserProfile = new UserProfile({
      userId,
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


// Get All Profiles for a User
router.get("/profiles/:userId", async (req, res) => {
  try {
    const profiles = await UserProfile.find({ userId: req.params.userId });
    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});





// Add Transaction Route
router.post("/transactions", async (req, res) => {
  const { userId, title, amount, category, date } = req.body;

  // Validate required fields
  if (!userId || !title || !amount || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Create a new transaction
    const newTransaction = new Transaction({
      userId,
      title,
      amount,
      category,
      date: date || Date.now(), // Use provided date or default to current date
    });

    // Save the transaction to the database
    await newTransaction.save();

    // Return success response
    res.status(201).json({ message: "Transaction added successfully", data: newTransaction });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// Get All Transactions for a User
router.get("/transactions/:userId", async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.params.userId });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

module.exports = router;



module.exports = router;