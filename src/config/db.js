import pkg from "pg";
const { Pool } = pkg;
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export const connectDB = async () => {
  try {
    await pool.connect();
    console.log("🟢 PostgreSQL connected");
  } catch (error) {
    console.log("🔴 DB Connection Error: ", error.message);
    process.exit(1);
  }
};
