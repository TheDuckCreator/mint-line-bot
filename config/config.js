import dotenv from "dotenv";
dotenv.config({});

const config = {
  openai: {
    baseURL: process.env.OPEN_API_BASE_URL,
    apiKey: process.env.OPEN_API_TOKEN,
    mainModelName: "scb10x/llama3.1-typhoon2-8b-instruct",
  },
};

export default config;
