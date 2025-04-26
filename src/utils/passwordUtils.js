exports.validatePasswordComplexity = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,32}$/;
  return regex.test(password);
};
