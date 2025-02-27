import express from "express";
import cors from "cors";
import path from "path";
import { promises as fs } from "fs";
//import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./config/db.js";
import AccountHandling from "./routes/AccountHandling.route.js";
import { config } from "dotenv";

config();

const port = process.env.NODE_PORT || 8000;

const app = express();

const vite = await createViteServer({
  server: {
    middlewareMode: true,
  },
  appType: "custom",
});

app.use(vite.middlewares);
app.use(cors());
app.use(express.json()); // Allows accepting JSON data in the body of the request
app.use("/api/account", AccountHandling);

app.use("*", async (req, res) => {
  try {
    const url = req.originalUrl;
    const template = await vite.transformIndexHtml(
      url,
      await fs.readFile(path.resolve("index.html"), "utf-8"),
    );
    const { render } = await vite.ssrLoadModule("/src/app-entry-server.jsx");
    const html = template.replace(`not rendered body`, render);

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
