import { app } from "./app.js";
import { connDb } from "./data/database.js";
import { config } from "dotenv";
import { dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import fs from "fs";
import path from "path";

const port = 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// SSL server
const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

connDb();

sslServer.listen(port, () => {
  console.log(`server is working! on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Hello Man!");
});

config({
  path: "./data/config.env",
});
