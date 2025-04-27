import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
//import { createServer as createViteServer } from "vite";
import { connectDB } from "./config/db.js";
import AccountHandling from "./routes/AccountHandling.route.js";
import { config } from "dotenv";

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

const port = process.env.NODE_PORT || 8000;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/account", AccountHandling);
app.use(
  express.static(path.join(projectRoot, "dist/client"), { index: false }),
);

app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl;
    const templatePath = path.join(projectRoot, "dist/client/index.html");
    const template = fs.readFileSync(templatePath, "utf-8");
    const { render } = await import(
      path.join(projectRoot, "dist/server/app-entry-server.js")
    );
    const html = template.replace(`not rendered body`, render(url));

    res.status(200).set({ "Content-Type": "text/html" }).end(html);
  } catch (e) {
    console.error(e);
    res.status(500).end(e.message);
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${port}`);
});
