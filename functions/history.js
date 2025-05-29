import fs from "fs";
import path from "path";

const __dirname = path.dirname(".");

export const readHistory = async () => {
  try {
    const data = fs.readFileSync(
      path.join(__dirname, "./history/history.json"),
      "utf8"
    );
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading history file:", error);
    return [];
  }
};

export const writeHistory = async (history) => {
  try {
    fs.writeFileSync(
      path.join(__dirname, "./history/history.json"),
      JSON.stringify(history, null, 2)
    );
  } catch (error) {
    console.error("Error writing to history file:", error);
  }
};

export const addToHistory = async (entries) => {
  try {
    const history = await readHistory();
    let newHistory;
    if (history.length > 6) {
      console.log("History is full, removing oldest entry");
      newHistory = history.slice(1);
    } else {
      newHistory = history;
    }
    const updatedEntries = [...newHistory, ...entries];
    await writeHistory(updatedEntries);
    console.log("Entry added to history");
  } catch (error) {
    console.error("Error adding to history:", error);
  }
};

export const clearHistory = async () => {
  try {
    await writeHistory([]);
    console.log("History cleared successfully.");
  } catch (error) {
    console.error("Error clearing history:", error);
  }
};
