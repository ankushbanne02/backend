const mongoose = require("mongoose");

console.log("Compiling UserProfile model..."); // Debugging log

const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number, required: true },
  annualIncome: { type: Number, required: true },
  monthlyIncome: { type: Number, required: true },
  rentExpense: { type: Number, required: true },
  foodExpense: { type: Number, required: true },
  miscellaneousExpense: { type: Number, required: true },
}, { timestamps: true });

// Check if the model is already compiled
if (mongoose.models.UserProfile) {
  console.log("UserProfile model already exists. Reusing..."); // Debugging log
  module.exports = mongoose.model("UserProfile");
} else {
  module.exports = mongoose.model("UserProfile", UserProfileSchema);
}