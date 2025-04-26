const service = require("../services/farmer.dashboard.service");
const db = require("../../../config/db");

exports.getProfile = async (req, res, next) => {
  try {
    const response = await service.getProfile(req.user.id);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getCard = async (req, res, next) => {
  try {
    const response = await service.getCard(req.user.id);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getBalance = async (req, res, next) => {
  try {
    const response = await service.getBalance(req.user.id);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const response = await service.getTransactions(req.user.id, req.query);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

exports.getFarmerDashboard = async (req, res, next) => {
  try {
    const farmerId = req.user.id; // from auth middleware (when ready)

    const totalProductsResult = await db.query(
      `SELECT COUNT(*) FROM farmer_products WHERE farmer_id = $1`,
      [farmerId]
    );

    const totalStockResult = await db.query(
      `SELECT COALESCE(SUM(quantity), 0) AS total_quantity FROM farmer_products WHERE farmer_id = $1`,
      [farmerId]
    );

    const lowStockResult = await db.query(
      `SELECT COUNT(*) FROM farmer_products WHERE farmer_id = $1 AND quantity < 10`,
      [farmerId]
    );

    const outOfStockResult = await db.query(
      `SELECT COUNT(*) FROM farmer_products WHERE farmer_id = $1 AND quantity = 0`,
      [farmerId]
    );

    const recentProductsResult = await db.query(
      `SELECT id, product_name, quantity, unit_price, image_url
       FROM farmer_products
       WHERE farmer_id = $1
       ORDER BY created_utc_date DESC
       LIMIT 5`,
      [farmerId]
    );

    return res.json({
      total_products: parseInt(totalProductsResult.rows[0].count),
      total_stock_quantity: parseInt(totalStockResult.rows[0].total_quantity),
      low_stock_products: parseInt(lowStockResult.rows[0].count),
      out_of_stock_products: parseInt(outOfStockResult.rows[0].count),
      recent_products: recentProductsResult.rows,
    });
  } catch (error) {
    next(error);
  }
};


exports.updateFarmerProfile = async (req, res, next) => {
  try {
    const farmerId = req.user.id;
    const { full_name, phone_number, email, address } = req.body;

    await db.query(
      `UPDATE farmers
       SET full_name = $1,
           phone_number = $2,
           email = $3,
           address = $4,
           updated_local_date = $5,
           updated_utc_date = NOW(),
           updated_ip = $6,
           updated_platform = $7
       WHERE id = $8`,
      [
        full_name,
        phone_number,
        email,
        address,
        req.localNepaliDate, // Will inject this later
        req.ip_address,       // Will inject this later
        req.user_agent,       // Will inject this later
        farmerId
      ]
    );

    return res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    next(error);
  }
};