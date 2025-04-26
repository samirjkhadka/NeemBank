const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmer.controller");
const {
  updateFarmerProfile,
} = require("../controllers/farmer.dashboard.controller");

router.get("/profile", farmerController.getFarmerProfile);
router.get("/card", farmerController.getFarmerCard);
router.get("/balance", farmerController.getFarmerBalance);
router.get("/transactions", farmerController.getFarmerTransactions);
router.get("/dashboard", getFarmerDashboard);
router.get("/update-profile", updateFarmerProfile);

module.exports = router;
