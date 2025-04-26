const pool = require("../../../db");
const emvqr = require("emv-qr");

exports.resolveQR = async (qrString) => {
  const data = emvqr.parse(qrString);
  const tag26 = data["26"] || data["27"];
  const payeeCode = tag26?.["01"]; // e.g. "FM-123" or "MT-456"

  if (!payeeCode) throw new Error("Invalid QR code");

  let result;
  if (payeeCode.startsWith("FM-")) {
    const farmerId = payeeCode.split("-")[1];
    const res = await pool.query(
      "SELECT id, full_name FROM farmers WHERE id = $1",
      [farmerId]
    );
    result = res.rows[0];
    result.type = "farmer";
  } else if (payeeCode.startsWith("MT-")) {
    const merchantId = payeeCode.split("-")[1];
    const res = await pool.query(
      "SELECT id, business_name FROM merchants WHERE id = $1",
      [merchantId]
    );
    result = res.rows[0];
    result.type = "merchant";
  } else {
    throw new Error("Unknown payee");
  }

  return result;
};

exports.pay = async (senderId, { payeeId, payeeType, amount }) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Debit sender (farmer)
    await client.query(
      `
      INSERT INTO transactions (farmer_id, txn_type, amount, status, created_by)
      VALUES ($1, 'debit', $2, 'success', $1)
    `,
      [senderId, amount]
    );

    // Credit receiver
    if (payeeType === "farmer") {
      await client.query(
        `
        INSERT INTO transactions (farmer_id, txn_type, amount, status, created_by)
        VALUES ($1, 'credit', $2, 'success', $1)
      `,
        [payeeId, amount]
      );
    } else {
      await client.query(
        `
        INSERT INTO merchant_transactions (merchant_id, txn_type, amount, status, created_by)
        VALUES ($1, 'credit', $2, 'success', $1)
      `,
        [payeeId, amount]
      );
    }

    await client.query("COMMIT");
    return { status: "success", message: "Payment completed" };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};
