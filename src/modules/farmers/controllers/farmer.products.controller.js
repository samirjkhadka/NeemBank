const FarmerProduct = require("../models/farmerProducts.model");
const { getNepaliDate } = require("../utils/nepaliDate.util");

const FarmerProductsController = {
  async create(req, res) {
    try {
      const farmerId = req.user.id; // assuming farmer id from auth middleware
      const data = {
        ...req.body,
        farmer_id: farmerId,
        created_by: farmerId,
        created_local_date: getNepaliDate(),
        created_ip: req.ip,
        created_platform: req.headers["user-agent"],
        image_url: null,
      };
      const product = await FarmerProduct.createProduct(data);
      res.status(201).json({ success: true, product });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  async list(req, res) {
    try {
      const farmerId = req.user.id;
      const products = await FarmerProduct.getProductsByFarmer(farmerId);
      res.json({ success: true, products });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const farmerId = req.user.id;
      const data = {
        ...req.body,
        updated_by: farmerId,
        updated_local_date: getNepaliDate(),
        updated_ip: req.ip,
        updated_platform: req.headers["user-agent"],
      };
      const updatedProduct = await FarmerProduct.updateProduct(id, data);
      res.json({ success: true, updatedProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  async softDelete(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await FarmerProduct.softDeleteProduct(id);
      res.json({ success: true, deletedProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  async uploadImage(req, res) {
    try {
      const { id } = req.params;
      const imageUrl = `/uploads/products/${req.file.filename}`;
      const updated = await FarmerProduct.updateProductImage(id, imageUrl);
      res.json({ success: true, updated });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Image upload failed" });
    }
  },
};

module.exports = FarmerProductsController;
