const express = require("express");
const FarmerProductsController = require("../controllers/farmerProducts.controller");
const upload = require("../middlewares/upload.middleware");
const authMiddleware = require("../../../middlewares/auth.middleware"); // assumed

const router = express.Router();

router.post("/", authMiddleware, FarmerProductsController.create);
router.get("/", authMiddleware, FarmerProductsController.list);
router.put("/:id", authMiddleware, FarmerProductsController.update);
router.delete("/:id", authMiddleware, FarmerProductsController.softDelete);
router.post(
  "/:id/upload-image",
  authMiddleware,
  upload.single("image"),
  FarmerProductsController.uploadImage
);

module.exports = router;
