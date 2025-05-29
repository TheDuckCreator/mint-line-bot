import dotenv from "dotenv";
dotenv.config({});

const config = {
  openai: {
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPEN_ROUTER_TOKEN,
    mainModelName: "scb10x/llama3.1-typhoon2-8b-instruct",
  },
};

export default config;
