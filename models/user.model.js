const mongoose = require("mongoose");

const UserProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  age: { type: Number, required: true },
  annualIncome: { type: Number, required: true },
  monthlyIncome: { type: Number, required: true },
  rentExpense: { type: Number, required: true },
  foodExpense: { type: Number, required: true },
  miscellaneousExpense: { type: Number, required: true }
}, { timestamps: true });

const UserProfile = mongoose.model("UserProfile", UserProfileSchema);

module.exports = UserProfile;