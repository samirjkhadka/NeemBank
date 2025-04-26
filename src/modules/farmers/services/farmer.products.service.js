const pool = require("../../../config/db"); // adjust if your db config path is different

const FarmerProduct = {
  async createProduct(data) {
    const query = `
            INSERT INTO farmer_products 
            (farmer_id, product_name, unit, price_per_unit, quantity, description, image_url, is_active, 
             created_by, created_local_date, created_ip, created_platform)
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, true, $8, $9, $10, $11)
            RETURNING *;
        `;
    const values = [
      data.farmer_id,
      data.product_name,
      data.unit,
      data.price_per_unit,
      data.quantity,
      data.description,
      data.image_url,
      data.created_by,
      data.created_local_date,
      data.created_ip,
      data.created_platform,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async getProductsByFarmer(farmerId) {
    const query = `SELECT * FROM farmer_products WHERE farmer_id = $1 AND is_active = true ORDER BY id DESC`;
    const { rows } = await pool.query(query, [farmerId]);
    return rows;
  },

  async updateProduct(id, data) {
    const query = `
            UPDATE farmer_products
            SET product_name = $1,
                unit = $2,
                price_per_unit = $3,
                quantity = $4,
                description = $5,
                updated_by = $6,
                updated_local_date = $7,
                updated_ip = $8,
                updated_platform = $9,
                updated_utc_date = NOW()
            WHERE id = $10 RETURNING *;
        `;
    const values = [
      data.product_name,
      data.unit,
      data.price_per_unit,
      data.quantity,
      data.description,
      data.updated_by,
      data.updated_local_date,
      data.updated_ip,
      data.updated_platform,
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  async softDeleteProduct(id) {
    const query = `
            UPDATE farmer_products
            SET is_active = false,
                updated_utc_date = NOW()
            WHERE id = $1 RETURNING *;
        `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },

  async updateProductImage(id, imageUrl) {
    const query = `
            UPDATE farmer_products
            SET image_url = $1,
                updated_utc_date = NOW()
            WHERE id = $2 RETURNING *;
        `;
    const { rows } = await pool.query(query, [imageUrl, id]);
    return rows[0];
  },
};

module.exports = FarmerProduct;
