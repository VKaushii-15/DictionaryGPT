import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
const backend = express();

backend.use(bodyParser.json());
backend.use(bodyParser.urlencoded({ extended: true }));

backend.listen(5500, () => {
  console.log("Server is running on port 5500");
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listen(UserChoice, prompt) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `${prompt}`,
      },
      {
        role: "user",
        content: `${UserChoice}`,
      },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 1,
    max_completion_tokens: 1024,
    top_p: 1,
    stream: false,
    response_format: {
      type: "json_object",
    },
    stop: null,
  });

  const output = JSON.parse(chatCompletion.choices[0].message.content);
  return output;
}

backend.post("/user", async (req, res) => {
  try {
    console.log(`WORD received ${req.body.word}`);
    const word = req.body.word;
    const lang = req.body.lang || "English"; // Default to English if no language is provided
    let Prompt = `You are a JSON-only dictionary API. Given a word in the language : ${lang}, return only a valid JSON object with these keys:
                - "word": the word itself.
                - "pronunciation": in readable phonetics.
                - "splitup": string or array splitting the word.
                - "root": origin of the word (use plain text, no brackets or quotes inside).
                - "synonyms": an array of 3 related words.
                - "meaning": an object with keys "noun" and "verb" having definitions.
                - "sentence": a sentence that uses the word wrapped in escaped double quotes (e.g., \\"example\\").

                Your response must be a valid JSON that can be parsed by \`JSON.parse()\`. Escape all quotes inside strings. Avoid unmatched brackets, parentheses, 
                or any malformed characters. Do not include explanations, only the JSON object.
                  `;
    if (!word) {
      return res.status(400).json({ error: "Word is required" });
    }
    const result = await listen(word, Prompt);
    console.log(`WORD received ${word}`);
    console.log(result);
    res.send(result);
  } catch (error) {
    console.error("Error processing request:", error);
    res.send(error.failed_generation);
  }
});
