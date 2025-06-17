// import Groq from "groq-sdk";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

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

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function listen(UserChoice, prompt) {
  const chatCompletion = ai.chats.create({
    model: "gemini-2.0-flash",
    history: [
      {
        role: "user",
        parts: [{ text: `${UserChoice}` }],
      },
      {
        role: "model",
        parts: [
          {
            text: `You are a helpful assistant. ${prompt} The word is "${UserChoice}".`,
          },
        ],
      },
    ],
  });

  try {
    const output = JSON.parse(rawContent);
    return output;
  } catch (err) {
    console.error("❌ JSON Parse Error: ", err.message);
    console.error("🧾 Raw Model Response: ", rawContent);
    throw new Error("Model response was not valid JSON.");
  }
}

backend.post("/user", async (req, res) => {
  const word = req.body.word;
  const prompt = `listen to the User's word , give its pronunciation splitup, Root of the word , 3 Synonyms , and meaning of the word 
                    as a verb and noun etc, the part of speech should be keys. The keys should be word , pronunciation , splitup , root , synonyms , meaning. And use it in a sentence, The word in the sentence should be inside double quotes. 
                    These should be given in JSON format , the key for the sentence should be 'sentence'\n`;
  if (!word) {
    return res.status(400).json({ error: "Word is required" });
  }

  try {
    console.log(`📥 Received word: ${word}`);

    const chat = await ai.chats.create({
      model: "gemini-2.0-flash",
      history: [
        {
          role: "user",
          parts: [{ text: word }],
        },
        {
          role: "model",
          parts: [
            {
              text: `You are a helpful assistant. ${prompt} The word is "${word}".`,
            },
          ],
        },
      ],
    });

    const result = await chat.sendMessage({
      message: `Please respond with the requested JSON structure.`,
    });

    const rawContent = result.response.text();

    console.log("📤 Model Response:", rawContent);

    const parsed = JSON.parse(rawContent);
    console.log("✅ JSON Parsed Result:", parsed);
    res.json(parsed);
  } catch (error) {
    console.error("❗Error in /user:", error.message);
    res.status(500).json({
      error: "Failed to process the word",
      details: error.message,
    });
  }
});
