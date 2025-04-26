const pool = require("../../../db");
const QRCode = require("qrcode");
const emvqr = require("emv-qr");

exports.getProfile = async (farmerId) => {
  const res = await pool.query(
    "SELECT id, full_name, mobile, email, dob, gender FROM farmers WHERE id = $1",
    [farmerId]
  );
  return res.rows[0];
};

exports.getCard = async (farmerId) => {
  const res = await pool.query(
    "SELECT id, qr_code_data FROM farmers WHERE id = $1",
    [farmerId]
  );
  const farmer = res.rows[0];

  const qrData = emvqr.generate({
    payloadFormatIndicator: "01",
    pointOfInitiationMethod: "11",
    merchantAccountInformation: {
      26: {
        "00": "NPAG", // custom domain
        "01": `FM-${farmer.id}`, // farmer ID tag
      },
    },
    merchantCategoryCode: "0000",
    transactionCurrency: "524", // NPR
    countryCode: "NP",
    merchantName: "Neemoh Farmer",
    merchantCity: "Kathmandu",
    additionalDataFieldTemplate: {
      "01": "Farmer Payment",
    },
  });

  const base64 = await QRCode.toDataURL(qrData);
  return {
    qrString: qrData,
    qrImage: base64,
  };
};

exports.getBalance = async (farmerId) => {
  // Later, pull from core banking
  return {
    balance: 13500.25,
    currency: "NPR",
    updatedAt: new Date(),
  };
};

exports.getTransactions = async (farmerId, { page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const res = await pool.query(
    `
    SELECT id, txn_type, amount, status, created_utc_date
    FROM transactions
    WHERE farmer_id = $1
    ORDER BY created_utc_date DESC
    LIMIT $2 OFFSET $3
  `,
    [farmerId, limit, offset]
  );

  return {
    page: Number(page),
    limit: Number(limit),
    transactions: res.rows,
  };
};
