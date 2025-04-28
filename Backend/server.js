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
    model: "llama-3.3-70b-versatile",
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
    const Einstein = req.body.Einstein;
    const Prompt = `Your task is to listen to the User's word , give its pronunciation splitup, Root of the word , 3 Synonyms , and meaning of the word 
                    as a verb and noun etc.The keys should be word , pronunciation , splitup , root , synonyms , meaning. And use it in a sentence, The word in the sentence should be inside double quotes. 
                    These should be given in JSON format , the key for the sentence should be 'sentence'\n`;
    if (!word) {
      return res.status(400).json({ error: "Word is required" });
    }
    if (Einstein === "Yes") {
      Prompt += `You are Albert Einstein , He always said that 'If your theory is explained to a 5 year old child , 
                  and they could explain it to another 5 year old child who completed understood it, only then you have a valid theory'
                  So, you have to explain the word in a way that a 5 year old child can understand it.`;
    }
    const result = await listen(word, Prompt);
    console.log(`WORD received ${word}`);
    console.log(result);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
