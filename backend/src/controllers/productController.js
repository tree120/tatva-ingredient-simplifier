const fs = require("fs");
const crypto = require("crypto");
const ScanHistory = require("../models/ScanHistory");
const ProductCache = require("../models/ProductCache");
const { analyzeIngredientsFromImage } = require("../services/aiService");

// Helper function to calculate SHA-256 hash of an uploaded file
const calculateImageHash = (filePath) => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

const verifyProduct = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "Please upload an ingredient list image." });
    }

    // 1. Calculate SHA-256 cryptographic hash of the image
    const imageHash = calculateImageHash(file.path);
    console.log(`Image Hash: ${imageHash.substring(0, 12)}...`);

    let aiAnalysis = null;
    let isFromCache = false;

    // 2. Check if this exact image was analyzed before
    const cachedProduct = await ProductCache.findOne({ imageHash });

    if (cachedProduct) {
      console.log(`[CACHE HIT] Found product "${cachedProduct.detectedProductName}" in cache! (Token saved 🎉)`);
      
      // Increment cache hit count
      cachedProduct.hitCount += 1;
      await cachedProduct.save();

      aiAnalysis = cachedProduct;
      isFromCache = true;
    } else {
      console.log(` [CACHE MISS] New image detected. Invoking Groq Vision AI...`);
      
      // 3. Run AI Vision analysis
      aiAnalysis = await analyzeIngredientsFromImage(file.path);

      // 4. Save to ProductCache collection for future identical requests
      try {
        await ProductCache.create({
          imageHash,
          detectedProductName: aiAnalysis.detectedProductName,
          brand: aiAnalysis.brand,
          productType: aiAnalysis.productType,
          ingredients: aiAnalysis.ingredients || [],
          harmfulIngredients: aiAnalysis.harmfulIngredients || [],
          allergenInfo: aiAnalysis.allergenInfo || [],
          additionalNotes: aiAnalysis.additionalNotes || [],
          recommendations: aiAnalysis.recommendations || "",
          isSafe: aiAnalysis.isSafe,
          verdictTitle: aiAnalysis.verdictTitle,
          verdictSubtitle: aiAnalysis.verdictSubtitle,
        });
        console.log(`Cached new product analysis in MongoDB.`);
      } catch (cacheErr) {
        console.warn("Failed to cache product:", cacheErr.message);
      }
    }

    const imageUrl = `http://localhost:${process.env.PORT || 5000}/uploads/${file.filename}`;

    const report = {
      productName: aiAnalysis.detectedProductName || "Packaged Product",
      brand: aiAnalysis.brand || "Detected Brand",
      batchNumber: "Image Verified",
      scanDate: new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      productType: aiAnalysis.productType || "Packaged Food",
      imageUrl,
      isSafe: aiAnalysis.isSafe,
      verdictTitle: aiAnalysis.verdictTitle,
      verdictSubtitle: aiAnalysis.verdictSubtitle,
      ingredients: aiAnalysis.ingredients || [],
      harmfulIngredients: aiAnalysis.harmfulIngredients || [],
      allergenInfo: aiAnalysis.allergenInfo || [],
      additionalNotes: [
        ...(aiAnalysis.additionalNotes || []),
        isFromCache ? "⚡ Instant result retrieved from verified cache (0 API tokens consumed)." : "✨ Newly analyzed with AI."
      ],
      recommendations: aiAnalysis.recommendations || "",
      cached: isFromCache,
    };

    // 5. Still save to this user's personal scan history
    if (req.user && req.user.sub) {
      await ScanHistory.create({
        userId: req.user.sub,
        ...report,
      });
    }

    return res.status(200).json(report);
  } catch (error) {
    console.error("Verification Controller Error:", error);
    return res.status(500).json({ message: "Failed to analyze product." });
  }
};

const getScanHistory = async (req, res) => {
  try {
    const history = await ScanHistory.find({ userId: req.user.sub }).sort({ createdAt: -1 });
    return res.status(200).json(history);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch scan history." });
  }
};

// Delete a single scan record by ID (scoped to the logged-in user)
const deleteScanItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.sub;

    const deletedItem = await ScanHistory.findOneAndDelete({ _id: id, userId });

    if (!deletedItem) {
      return res.status(404).json({ message: "Scan item not found or unauthorized." });
    }

    return res.status(200).json({ message: "Scan deleted successfully.", id });
  } catch (error) {
    console.error("Delete scan item error:", error);
    return res.status(500).json({ message: "Failed to delete scan item." });
  }
};

// Clear all scan history for the logged-in user
const clearAllHistory = async (req, res) => {
  try {
    const userId = req.user.sub;
    await ScanHistory.deleteMany({ userId });
    return res.status(200).json({ message: "All scan history cleared successfully." });
  } catch (error) {
    console.error("Clear all history error:", error);
    return res.status(500).json({ message: "Failed to clear history." });
  }
};

// Export them alongside your existing controllers:
module.exports = {
  verifyProduct,
  getScanHistory,
  deleteScanItem,
  clearAllHistory,
};
