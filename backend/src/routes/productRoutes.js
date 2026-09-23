const express = require("express");
const {
  verifyProduct,
  getScanHistory,
  deleteScanItem,
  clearAllHistory,
} = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/verify", protect, upload.single("image"), verifyProduct);
router.get("/history", protect, getScanHistory);

// DELETE endpoints
router.delete("/history/:id", protect, deleteScanItem);
router.delete("/history", protect, clearAllHistory);

module.exports = router;