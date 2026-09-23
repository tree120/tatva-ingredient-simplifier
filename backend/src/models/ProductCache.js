const mongoose = require("mongoose");

const productCacheSchema = new mongoose.Schema(
  {
    imageHash: {
      type: String,
      required: true,
      unique: true,
      index: true, // Fast lookup
    },
    detectedProductName: { type: String, default: "Packaged Food" },
    brand: { type: String, default: "Detected Brand" },
    productType: { type: String, default: "Snack" },
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
    isSafe: { type: Boolean, required: true },
    verdictTitle: { type: String, required: true },
    verdictSubtitle: { type: String },
    hitCount: { type: Number, default: 1 }, // Tracks how many times this saved API tokens!
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductCache", productCacheSchema);