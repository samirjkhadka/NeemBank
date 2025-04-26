const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmer.controller");
const dashboardRoutes = require("../modules/farmer/dashboard/dashboard.routes");

//Registration
router.post("/register", farmerController.registerFarmer);
router.post("/verify-otp", farmerController.verifyOtp);

//Auth
router.post("/login", farmerController.loginFarmer);

//Forgot Password
router.post("/forgot-password", farmerController.forgotPassword);
router.post("/reset-password", farmerController.resetPassword);
router.put("/change-password", farmerController.changePassword);

//Dashboard
router.use("/", dashboardRoutes);

//Payment
router.use("/payment", require("./farmer.payment.routes"));

//Wallet
router.use("/wallet", require("./routes/farmer.wallet.routes"));

module.exports = router;
