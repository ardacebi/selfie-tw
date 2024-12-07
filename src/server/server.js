import express from "express";
import { createServer as createViteServer } from "vite";
import { connectDB } from "./config/db.js";
import AccountHandling from "./routes/AccountHandling.route.js";

const port = process.env.PORT || 3000;

export const ViteNodeApp = async () => {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: "ssr" },
  });

  app.use(vite.middlewares);

  app.use(express.json()); //allows to accept JSON data in the body of the request

  app.use("/api/account", AccountHandling);

  app.use("*", async (req, res) => {
    try {
      const url = req.originalUrl;

      let template = await vite.transformIndexHtml(
        url,
        `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Selfie!</title>
          </head>
          <body>
            <div id="root">not rendered</div>

            <script type="module" src="./client/App.jsx"></script>
          </body>
        </html>
      `,
      );

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(port, () => {
    connectDB();
    console.log(`Server is running at http://localhost:${port}`);
  });

  return app;
};
