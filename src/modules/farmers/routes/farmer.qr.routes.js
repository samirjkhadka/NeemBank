// src/modules/farmer-qr/FarmerQRRoutes.js

const express = require('express');
const router = express.Router();
const FarmerQRController = require('./FarmerQRController');
const authMiddleware = require('../../middlewares/authMiddleware');

router.get("/generate", authMiddleware, FarmerQRController.generate);

module.exports = router;
