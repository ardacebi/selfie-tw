import express from 'express';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

console.log(process.env.MONGO_URI);


const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Server is ready");
});

app.listen(port, () => {
    connectDB();
    console.log(`Server is running at http://localhost:${port}`);
  });