import "dotenv/config";
import express from "express";
import {
  InteractionResponseType,
  InteractionType,
  verifyKeyMiddleware,
} from "discord-interactions";
import chat from "../functions/chat.js";
import { DiscordRequest } from "../config/discord.js";
// Create an express app
const router = express.Router();
// Get port, or default to 3000
// To keep track of our active games

const waitableChat = async ({ input, token }) => {
  const endpoint = `webhooks/${process.env.APP_ID}/${token}/messages/@original`;
  try {
    const responseMessage = await chat({
      input,
      useHistory: true,
    });
    console.log("input", input);
    console.log("Response from chat function:", responseMessage);
    await DiscordRequest(endpoint, {
      method: "PATCH",
      body: {
        content: responseMessage,
      },
    });
    console.log("Response from chat function:", responseMessage);
  } catch (error) {
    console.error("Error in chat function:", error.message);
    try {
      await DiscordRequest(endpoint, {
        method: "PATCH",
        body: {
          content: "ไม่สามารถตอบได้อ่ะ",
        },
      });
    } catch (error) {
      console.error("ไม่ได้อ่ะ เลิกเถอะ", error.message);
    }
  }
};
/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
router.post(
  "/interactions",
  verifyKeyMiddleware(process.env.PUBLIC_KEY),
  async function (req, res) {
    // Interaction id, type and data
    const { id, type, data, token, message } = req.body;
    /**
     * Handle verification requests
     */
    if (type === InteractionType.PING) {
      return res.send({ type: InteractionResponseType.PONG });
    }

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (type === InteractionType.APPLICATION_COMMAND) {
      const { name } = data;

      console.log("Message:", message);
      console.log("Data:", data);

      // "test" command
      if (name === "mint") {
        const objectName = req.body.data.options[0];
        const commandValue = objectName?.value;
        console.log("Mint command triggered with object:", commandValue);
        // Send a message into the channel where command was triggered from

        const responseMessage = waitableChat({
          input: commandValue,
          //  interactionId: data.id,
          token,
        });
        console.log("Response from chat function:", responseMessage);

        return res.send({
          type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });
      }

      console.error(`unknown command: ${name}`);
      return res.status(400).json({ error: "unknown command" });
    }

    console.error("unknown interaction type", type);
    return res.status(400).json({ error: "unknown interaction type" });
  }
);

export default router;
