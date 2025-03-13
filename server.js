const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;

const WEBHOOK_TOKEN = process.env.WEBHOOK_TOKEN;
const PASSWORD = process.env.PASSWORD;

const SECRET = process.env.SECRET;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Function to verify the signature
const verifySignature = (secret, payload, signature) => {
  if (!secret || !payload || !signature) return false;
  const digest = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(digest, "utf-8"),
    Buffer.from(signature, "utf-8")
  );
};

// Function to generate signature
const generate = (secret, payload) => {
  const digest = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return digest;
};

// Middleware to verify the webhook tooken, signature
const verifyWebhookMiddleware = (webhookToken, secret) => {
  return (req, res, next) => {
    const signature = req?.params?.signature;
    const token = req?.params?.token;
    const payload = req.body;

    console.log("Req params", req?.params);
    // Check if webhook teken query is missing or invalid
    if (!token || token !== webhookToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Check if signature is missing
    if (!signature) {
      return res
        .status(401)
        .json({ error: "Signature or timestamp header is missing" });
    }

    // Check if the payload is valid
    if (!payload?.events) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Verify the signature
    const tokenPayload = JSON.stringify({ token });
    if (!verifySignature(secret, tokenPayload, signature)) {
      return res.status(403).json({ error: "Invalid signature" });
    }
    next();
  };
};

// Endpoint to receive webhook payloads
app.post(
  "/webhook/:token/:signature",
  verifyWebhookMiddleware(WEBHOOK_TOKEN, SECRET),
  (req, res) => {
    console.log("Received webhook payload:", req.body);
    const { events, destination } = req.body;

    // Example: handling a specific event
    console.log("Events", events);
    res.status(200).send("Webhook received successfully");
  }
);

// Request For Signature Generation
app.post("/generate-signature", (req, res) => {
  const payload = req.body;
  const inputPassword = payload?.password;
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

// Start the server
app.listen(PORT, () => {
  console.log(`Secure webhook server running on port ${PORT}`);
});
