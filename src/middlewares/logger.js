import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "user-service" },
  transports: [new winston.transports.Console()],
});

export default (req, res, next) => {
  logger.info({
    method: req.method,
    url: req.url,
    ip: req.ip,
    headers: req.headers,
    timestamp: new Date().toISOString(),
  });
  next();
};
