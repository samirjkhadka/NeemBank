const express = require("express");
const router = express.Router();
const auth = require("../../../middlewares/auth.middleware");
const controller = require("../controllers/farmer.payment.controller");

router.post("/resolve-qr", auth("farmer"), controller.resolveQR);
router.post("/pay", auth("farmer"), controller.pay);

module.exports = router;
