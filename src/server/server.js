import express from "express";
import cors from "cors";
import path from "path";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./config/db.js";
import AccountHandling from "./routes/AccountHandling.route.js";
import { config } from "dotenv";

config();
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.NODE_PORT || 8000;
const base = process.env.BASE || "/";
const app = express();

//app.use(cors());
app.use(express.json()); // Allows accepting JSON data in the body of the request
app.use(express.urlencoded({ extended: true }));

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile("./dist/client/index.html", "utf-8")
  : "";

let vite;
if (!isProduction) {
  vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    base,
  });
  app.use(vite.middlewares);
} else {
  const compression = (await import("compression")).default;
  const sirv = (await import("sirv")).default;
  app.use(compression());
  app.use(base, sirv("./dist/client", { extensions: [] }));
}

app.use("/api/account", AccountHandling);

/*
  app.get("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      console.error(e);
      res.status(500).end(e.message);
    }
  });
  */

// Serve HTML
app.get("*", async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, "");

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile("./index.html", "utf-8");
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule("/src/app-entry-server.jsx")).render(
        url,
      );
    } else {
      template = templateHtml;
      render = (await import("../../dist/server/app-entry-server.js")).render(
        url,
      );
    }

    const rendered = await render(url);

    const html = template
      .replace(`not rendered head`, rendered.head ?? "")
      .replace(`not rendered body`, rendered.html ?? "");

    res.status(200).set({ "Content-Type": "text/html" }).send(html);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${port}`);
});
