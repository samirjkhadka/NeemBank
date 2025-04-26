import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import useragent from "express-useragent";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import logger from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import { farmerRoutes } from "./modules/farmers/routes/farmer.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(useragent.express());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

app.use("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to NeemBank" });
});

app.use("/uploads", express.static("uploads"));

app.use("/api/farmers", farmerRoutes);

app.use(logger);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
