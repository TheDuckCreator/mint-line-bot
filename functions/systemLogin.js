import _ from "lodash";
import jwt from "jsonwebtoken";
import axios from "axios";
import dotenv from "dotenv";
import logger from "../config/logger.js";

dotenv.config();

// Handle For Line Login
/** This Example when use #LineLogin is send it must be followed by System: and UserId:
 * We get this data and then we update to our system to tell them as a user id in the system
 * have this user id in line account.
 */
const systemLogin = async ({ event, eventText, eventCode }) => {
  logger.info(`[${eventCode}] System Login Event`);
  const splitByLine = _.split(eventText, "\n");

  // Find System URL
  const systemName = _.find(splitByLine, (line) => _.includes(line, "System:"));
  const systemNameSplit = _.split(systemName, "System:");
  const systemURL = systemNameSplit?.[1];
  logger.info(`[${eventCode}] System URL: ${systemURL}`);

  // Find User ID
  const userID = _.find(splitByLine, (line) => _.includes(line, "UserId:"));
  const userIDSplit = _.split(userID, "UserId:");
  const userIDValue = userIDSplit?.[1];
  logger.info(`[${eventCode}] User ID: ${userIDValue}`);
  // Update to system
  const token = jwt.sign({ userID: userIDValue }, process.env.SECRET);
  const response = await axios({
    method: "put",
    url: `${systemURL}/api/v1/employee/${userIDValue}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      line_account_id: event?.source?.userId,
      enable_message_api: true,
    },
  });
  if (response?.status === 200) {
    logger.info(`[${eventCode}] User ID updated successfully`);
    return true;
  } else {
    logger.error(`[${eventCode}] User ID update failed`);
    return false;
  }
};

export default systemLogin;
