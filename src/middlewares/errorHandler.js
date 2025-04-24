export default (err, req, res, next) => {
  console.error("", err.stack);
  req.status(500).json({ error: "Internal Server Error" });
};
