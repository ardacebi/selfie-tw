import { connect } from "mongoose";
import { config } from "dotenv";

config();

export const connectDB = async () => {
  try {
    const conn = await connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error ${error.message}`);
    process.exit(1);
  }
};
