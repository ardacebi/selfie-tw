import express from "express";
//import { createServer as createViteServer } from "vite";
import { connectDB } from "./config/db.js";
import AccountHandling from "./routes/AccountHandling.route.js";
import { config } from "dotenv";

config();

const port = process.env.NODE_PORT || 5532;

const app = express();

//I tried to use vite-plugin-node to start the server, but it didn't work
/*
const vite = await createViteServer({
  server: { middlewareMode: "ssr" },
});

app.use(vite.middlewares);
*/
app.use(express.json()); // Allows accepting JSON data in the body of the request
app.use("/api/account", AccountHandling);

app.get("*", async (req, res) => {
  try {
    const url = req.originalUrl;

    res.status(200).set({ "Content-Type": "text/html" }).end(template);
  } catch (e) {
    //I tried to use vite-plugin-node to start the server, but it didn't work
    //vite.ssrFixStacktrace(e);
    console.error(e);
    res.status(500).end(e.message);
  }
});

app.listen(port, () => {
  connectDB();
  console.log(`Server is running at http://localhost:${port}`);
});

//I tried to use vite-plugin-node to start the server, but it didn't work
//export const viteNodeApp = app;
