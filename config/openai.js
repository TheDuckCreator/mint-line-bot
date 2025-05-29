import OpenAI from "openai";
import config from "./config.js";

const openai = new OpenAI({
  baseURL: config.openai.baseURL,
  apiKey: config.openai.apiKey,
});

export default openai;
