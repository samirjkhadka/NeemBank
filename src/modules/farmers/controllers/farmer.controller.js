const farmerService = require("../services/farmer.service");
const { validationRegistration } = require("../validations/farmer.validation");
const db = require('../../../config/db');


exports.registerFarmer = async (req, res, next) => {
  try {
    const { error } = validationRegistration(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const respons = await farmerService.registerFarmer(req.body, req);
    res.status(200).json(respons);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.verifyOtp = async (req, res, next) => {
  try {
    const { error } = validationRegistration(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const response = await farmerService.verifyOtp(req.body, req);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.loginFarmer = async (req, res, next) => {
  try {
    const response = await farmerService.loginFarmer(req.body, req);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const response = await farmerService.forgotPassword(req.body, req);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const response = await farmerService.resetPassword(req.body, req);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const farmerId = req.user.id;
    const { old_password, new_password } = req.body;

    // 1. Get current password hash
    const result = await db.query(
      `SELECT password FROM farmers WHERE id = $1`,
      [farmerId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Farmer not found.' });
    }

    const currentPasswordHash = result.rows[0].password;

    // 2. Verify old password
    const isOldPasswordCorrect = await bcrypt.compare(old_password, currentPasswordHash);
    if (!isOldPasswordCorrect) {
      return res.status(400).json({ message: 'Old password is incorrect.' });
    }

    // 3. Validate new password complexity
    const isPasswordValid = validatePasswordComplexity(new_password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'New password does not meet complexity rules.' });
    }

    // 4. Check password history
    const historyResult = await db.query(
      `SELECT password FROM farmer_password_history
       WHERE farmer_id = $1
       ORDER BY created_at DESC
       LIMIT 3`,
      [farmerId]
    );

    const passwordUsedBefore = await Promise.any(
      historyResult.rows.map(row => bcrypt.compare(new_password, row.password))
    ).catch(() => false); // catch if none matches

    if (passwordUsedBefore) {
      return res.status(400).json({ message: 'Cannot reuse recent passwords.' });
    }

    // 5. Update password
    const hashedNewPassword = await bcrypt.hash(new_password, 10);

    await db.query(
      `UPDATE farmers
       SET password = $1,
           updated_local_date = $2,
           updated_utc_date = NOW(),
           updated_ip = $3,
           updated_platform = $4
       WHERE id = $5`,
      [
        hashedNewPassword,
        req.localNepaliDate,
        req.ip_address,
        req.user_agent,
        farmerId
      ]
    );

    // 6. Insert into password history
    await db.query(
      `INSERT INTO farmer_password_history (farmer_id, password)
       VALUES ($1, $2)`,
      [farmerId, hashedNewPassword]
    );

    return res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};