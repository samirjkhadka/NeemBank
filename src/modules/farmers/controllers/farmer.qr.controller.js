// src/modules/farmer-qr/FarmerQRController.js

const qrcode = require("qrcode");
const { generateEmvQr } = require("../../utils/emvQrGenerator");

class FarmerQRController {
  static async generate(req, res) {
    try {
      const farmer = req.user; // assuming JWT middleware attaches farmer

      const emvData = generateEmvQr({
        accountNumber: farmer.account_number,
        farmerName: farmer.full_name,
        city: farmer.address || "Kathmandu",
      });

      const qrImage = await qrcode.toDataURL(emvData);

      return res.status(200).json({
        success: true,
        message: "QR Code generated successfully",
        emvData,
        qrImage,
      });
    } catch (error) {
      console.error("QR Error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Failed to generate QR" });
    }
  }
}

module.exports = FarmerQRController;
