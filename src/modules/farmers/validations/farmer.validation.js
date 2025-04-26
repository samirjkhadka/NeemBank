const joi = require("joi");

exports.validationRegistration = (data) => {
  return joi
    .object({
      name: joi
        .string()
        .length(10)
        .pattern(/^[9][7-8][0-9]{8}$/)
        .required(),
      email: joi.string().required(),
      password: joi
        .string()
        .min(12)
        .max(32)
        .pattern(/[A-Z]/)
        .pattern(/[a-z]/)
        .pattern(/[0-9]/)
        .pattern(/[^a-zA-Z0-9]/)
        .required(),
      phone: joi.string().required(),
      address: joi.string().required(),
      otp: joi.string().length(6).required(),
    })
    .validate(data);
};

exports.validateLogin = (data) => {
  return joi
    .object({
      mobile: joi
        .string()
        .length(10)
        .pattern(/^[9][7-8][0-9]{8}$/)
        .required(),
      password: joi.string().required(),
    })
    .validate(data);
};

exports.validateForgotPassword = (data) => {
  return joi
    .object({
      mobile: joi
        .string()
        .length(10)
        .pattern(/^[9][7-8][0-9]{8}$/)
        .required(),
    })
    .validate(data);
};

exports.validateResetPassword = (data) => {
  return joi
    .object({
      mobile: joi
        .string()
        .length(10)
        .pattern(/^[9][7-8][0-9]{8}$/)
        .required(),
      otp: joi.string().length(6).required(),
      newPassword: joi
        .string()
        .min(12)
        .max(32)
        .pattern(/[A-Z]/)
        .pattern(/[a-z]/)
        .pattern(/[0-9]/)
        .pattern(/[^a-zA-Z0-9]/)
        .required(),
    })
    .validate(data);
};
