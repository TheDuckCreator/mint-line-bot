import { addToHistory, readHistory } from "./history.js";
import config from "../config/config.js";
import { instruction, userInstruction } from "../config/instruction.js";
import openai from "../config/openai.js";

const chat = async ({ input, useSearch = false, useHistory = false }) => {
  try {
    let history = [];
    if (useHistory) {
      history = await readHistory();
    }

    const response = await openai.chat.completions.create({
      model: config.openai.mainModelName,
      plugins: useSearch ? [{ id: "web" }] : [],
      messages: [
        {
          role: "assistant",
          content: instruction,
        },
        {
          role: "user",
          content: userInstruction,
        },
        ...history,
        {
          role: "user",
          content: input || "Hello, how are you?",
        },
      ],
      max_tokens: 1024,
      max_results: 1,
    });
    const result = response.choices[0].message.content;
    if (useHistory) {
      await addToHistory([
        {
          role: "user",
          content: input || "Hello, how are you?",
        },
        {
          role: "assistant",
          content: result,
        },
      ]);
    }
    return result;
  } catch (error) {
    console.error("Error in chat function:", error.message);
    return "ไม่สามารถตอบได้อ่ะ";
  }
};

export default chat;
