const pool = require("../../../config/database");
const bcrypt = require("bcrypt");
const otpUtil = require("../../../utils/otp");
const nepaliDate = require("../../../utils/nepaliDate");

exports.registerFarmer = async (data, req) => {
  const { mobile } = data;
  const otp = otpUtil.generateOtp();

  await pool.query(
    `INSERT INTO farmers_pending (mobile, otp, otp_expiry, created_by, created_ip, created_platform, created_local_date, created_utc_date)
    VALUES ($1, $2, NOW() + INTERVAL '5 minutes', 'self', $3, $4, $5, NOW())
    ON CONFLICT (mobile) DO UPDATE SET
      otp = EXCLUDED.otp,
      otp_expiry = EXCLUDED.otp_expiry`,
    [mobile, otp, req.ip, req.headers["user-agent"], nepaliDate()]
  );
  console.log(`📲 OTP for ${mobile}: ${otp}`);
  return { message: "OTP sent successfully for verification" };
};

exports.verifyOtp = async (data, req) => {
  const { mobile, otp, password } = data;

  const result = await pool.query(
    "SELECT * FROM farmers_pending WHERE mobile = $1",
    [mobile]
  );
  const record = result.rows[0];

  if (!record) {
    throw new Error("User not found");
  }

  if (record.otp !== otp || new Date(record.otp_expiry) < new Date()) {
    throw new Error("Invalid  or Expired OTP");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await pool.query(
    "INSERT INTO farmers (mobile, password, created_by, created_ip, created_platform, created_local_date, created_utc_date) VALUES ($1, $2, 'self', $3, $4, $5, NOW())",
    [mobile, hashedPassword, req.ip, req.headers["user-agent"], nepaliDate()]
  );

  await pool.query("DELETE FROM farmers_pending WHERE mobile = $1", [mobile]);

  return { message: "Registration successful" };
};

exports.loginFarmer = async ({ mobile, password }, req) => {
  const result = await pool.query("SELECT * FROM farmers WHERE mobile = $1", [
    mobile,
  ]);
  const farmer = result.rows[0];
  if (!farmer) {
    throw new Error("User not found");
  }
  const valid = await bcrypt.compare(password, farmer.password);
  if (!valid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { id: farmer.id, role: "farmer" },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign(
    { id: farmer.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  return { token, refreshToken: refreshToken, message: "Login successful" };
};

exports.forgotPassword = async ({ mobile }, req) => {
  const result = await pool.query("SELECT * FROM farmers WHERE mobile = $1", [
    mobile,
  ]);
  const farmer = result.rows[0];
  if (!farmer) {
    throw new Error("User not found");
  }

  const otp = otpUtil.generateOtp();
  await pool.query(
    ` UPDATE farmers SET otp = $1, otp_expiry = NOW() + INTERVAL '5 minutes'
    WHERE mobile = $2
  `,
    [otp, mobile]
  );

  console.log(`📲 OTP for ${mobile}: ${otp}`);
  return { message: "OTP sent successfully for verification" };
};

exports.resetPassword = async ({ mobile, otp, newPassword }, req) => {
  const result = await pool.query("SELECT * FROM farmers WHERE mobile = $1", [
    mobile,
  ]);
  const farmer = result.rows[0];
  if (!farmer) {
    throw new Error("User not found");
  }

  if (farmer.otp !== otp || new Date(farmer.otp_expiry) < new Date()) {
    throw new Error("Invalid  or Expired OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await pool.query(
    ` UPDATE farmers
    SET password = $1,
        otp = NULL,
        otp_expiry = NULL,
        updated_by = 'self',
        updated_ip = $2,
        updated_platform = $3,
        updated_local_date = $4,
        updated_utc_date = NOW()
    WHERE mobile = $5`,
    [hash, req.ip, req.headers["user-agent"], nepaliDate(), mobile]
  );

  return { message: "Password reset successful" };
};

exports.logoutFarmer = async (req, res) => {};

exports.changePassword = async (req, res) => {};

exports.updateProfile = async (req, res) => {};
