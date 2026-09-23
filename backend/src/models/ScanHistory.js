const mongoose = require("mongoose");

const scanHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productName: { type: String, default: "Packaged Product" },
    brand: { type: String, default: "Detected Brand" },
    productType: { type: String, default: "Snack" },
    imageUrl: { type: String },
    isSafe: { type: Boolean, required: true },
    verdictTitle: { type: String, required: true },
    verdictSubtitle: { type: String },
    ingredients: [
      {
        name: { type: String },
        status: {
          type: String,
          enum: ["Safe", "Moderate", "High", "Not Safe", "Allergen"],
        },
      },
    ],
    harmfulIngredients: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    allergenInfo: [
      {
        name: { type: String },
        description: { type: String },
      },
    ],
    additionalNotes: [{ type: String }],
    recommendations: { type: String },
    scanDate: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ScanHistory", scanHistorySchema);