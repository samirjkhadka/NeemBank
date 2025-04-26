const pool = require("../../../db");

exports.getBalance = async (farmerId) => {
  const res = await pool.query(
    `
    SELECT 
      COALESCE(SUM(CASE WHEN txn_type = 'credit' THEN amount ELSE 0 END), 0) -
      COALESCE(SUM(CASE WHEN txn_type = 'debit' THEN amount ELSE 0 END), 0) AS balance
    FROM transactions
    WHERE farmer_id = $1 AND status = 'success'
  `,
    [farmerId]
  );

  return { balance: parseFloat(res.rows[0].balance || 0) };
};

exports.getTransactions = async (farmerId) => {
  const res = await pool.query(
    `
    SELECT txn_id, txn_type, amount, status, created_local_date, created_utc_date
    FROM transactions
    WHERE farmer_id = $1
    ORDER BY created_utc_date DESC
  `,
    [farmerId]
  );

  return { transactions: res.rows };
};
