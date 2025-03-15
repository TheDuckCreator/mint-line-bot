import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

// Function to verify the signature
export const verifySignature = (secret, payload, signature) => {
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
export const generate = (secret, payload) => {
  const digest = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return digest;
};

// Middleware to verify the webhook tooken, signature
export const verifyWebhookMiddleware = (webhookToken, secret) => {
  return (req, res, next) => {
    const signature = req?.params?.signature;
    const token = req?.params?.token;
    const payload = req.body;

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
