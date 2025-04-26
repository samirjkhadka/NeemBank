const service = require("../services/farmer.payment.service");

exports.resolveQR = async (req, res, next) => {
  try {
    const result = await service.resolveQR(req.body.qrString);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

exports.pay = async (req, res, next) => {
  try {
    const result = await service.pay(req.user.id, req.body);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
