import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import * as url from "url";
import dayjs from "dayjs";

import { generate, verifyWebhookMiddleware } from "./functions/middleware.js";
import eventHandling from "./functions/eventHandling.js";
import logger from "./config/logger.js";
import discordRoute from "./routes/discord.route.js";

dotenv.config();

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const app = express();

// Configuration
const PORT = process.env.PORT || 3000;
const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;
const PASSWORD = process.env.PASSWORD;
const SECRET = process.env.SECRET;
const URL_PREFIX = process.env.WEBHOOK_URL_PREFIX;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors({}));

// Serve the frontend
app.use("/", express.static(path.join(__dirname, "./frontend/dist")));

// Endpoint to receive webhook payloads
app.post(
  "/webhook/:token/:signature",
  verifyWebhookMiddleware(WEBHOOK_TOKEN, SECRET),
  async (req, res) => {
    console.log("hello");
    try {
      const { events, destination } = req.body;
      const startTime = dayjs();
      const code = startTime.format("YYYYMMDDHHmmss");
      logger.info(`[${code}] Signature: ${req.params.signature}`);
      logger.info(`------------------------`);
      logger.info(`[${code}] Events: ${JSON.stringify(events)}`);
      logger.info(`[${code}] Destination: ${JSON.stringify(destination)}`);
      // Example: handling a specific event
      for await (const event of events) {
        await eventHandling(event, code);
      }
      res.status(200).send("Webhook received successfully");
    } catch (error) {
      res.status(400).json({
        error: "Error in processing the webhook payload",
        message: error?.message,
      });
    }
  }
);

// Request For Signature Generation
app.post("/api/generate-signature", (req, res) => {
  const payload = req.body;
  const inputPassword = req?.headers.authorization
    ? req.headers.authorization.split(" ")[1]
    : null;
  const inputToken = payload?.token;
  if (!inputPassword) {
    return res.status(400).json({ error: "Webhook Password is missing" });
  }
  if (!inputToken) {
    return res.status(400).json({ error: "Webhook Token is missing" });
  }
  if (inputPassword !== PASSWORD) {
    return res.status(401).json({ error: "Unauthorized Invalid Password" });
  }
  if (inputToken !== WEBHOOK_TOKEN) {
    return res.status(401).json({ error: "Unauthorized Invalid Token" });
  }

  const signature = generate(
    SECRET,
    JSON.stringify({
      token: inputToken,
    })
  );
  res.json({ signature });
});

app.get("/api/info", (req, res) => {
  res.json({
    token: WEBHOOK_TOKEN,
    urlPrefix: URL_PREFIX,
  });
});

app.use("/api/discord", discordRoute);

// Start the server
app.listen(PORT || 3004, () => {
  console.log(`Secure webhook server running on port ${PORT}`);
});
