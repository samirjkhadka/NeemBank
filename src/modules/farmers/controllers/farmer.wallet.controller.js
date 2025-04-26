const service = require("../services/farmer.wallet.service");

exports.getBalance = async (req, res, next) => {
  try {
    const result = await service.getBalance(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const result = await service.getTransactions(req.user.id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
