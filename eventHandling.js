import _ from "lodash";
import { systemLogin } from "./functions/index.js";
import logger from "./config/logger.js";
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
    console.log("Event Text:", eventText);
  } catch (error) {
    logger.error(
      `Error in processing the event: ${
        error?.response?.data?.error?.message || error?.message
      }`
    );
  }
}

export default eventHandling;
