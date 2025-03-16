
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Associate transaction with a user
  title: { type: String, required: true },
  amount: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    enum: ["rent", "food", "education", "clothing", "miscellaneous"], // Restrict category to specific values
  },
  date: { type: Date, default: Date.now }, // Default to current date if not provided
}, { timestamps: true });

// Check if the model is already compiled
if (mongoose.models.Transaction) {
  module.exports = mongoose.models.Transaction;
} else {
  module.exports = mongoose.model("Transaction", TransactionSchema);
}