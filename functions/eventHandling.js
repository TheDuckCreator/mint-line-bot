import _ from "lodash";
import axios from "axios";
import dotenv from "dotenv";
import chat from "./chat.js";

dotenv.config({});
/**
 * We Command data by typeing # followed by command
 * in the chat box of line.
 * User can type or click from liff or rich menu in Line Official Account.
 * Then It come here and we start with find the command
 * then find the attribute that writing in the chat box.
 * that is under the regulation of command that we define.
 */
async function eventHandling(event, code) {
  try {
    const eventText = event?.message?.text;
    const replyToken = event.replyToken;

    console.log("Event Text:", eventText);
    const responseMessage = await chat({
      input: eventText,
      useHistory: true,
    });
    /**
     * @type {import("axios").AxiosRequestConfig}
     */
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
      },
      data: {
        replyToken: replyToken,
        messages: [
          {
            type: "text",
            text: responseMessage || "ไม่สามารถตอบได้อ่ะ",
          },
        ],
      },
      url: "https://api.line.me/v2/bot/message/reply",
      method: "post",
    };

    const { status } = await axios(config);
    console.log("Response status:", status);
  } catch (error) {
    console.error("Error in event handling:", error.message);
  }
}

export default eventHandling;
