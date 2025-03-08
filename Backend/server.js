import { Groq } from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

console.log(process.env.GROQ_API_KEY);
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
// async function main() {
//   const chatCompletion = await groq.chat.completions.create({
//     messages: [
//       {
//         role: "system",
//         content:
//           "Your task is to listen to the User's word , give its pronunciation splitup, Root of the word , 3 Synonyms , and meaning of the word as a verb and noun etc.\n",
//       },
//       {
//         role: "user",
//         content: "Abstract",
//       },
//     ],
//     model: "llama-3.3-70b-versatile",
//     temperature: 1,
//     max_completion_tokens: 1024,
//     top_p: 1,
//     stream: true,
//     stop: null,
//   });

//   for await (const chunk of chatCompletion) {
//     process.stdout.write(chunk.choices[0]?.delta?.content || "");
//   }
// }

// main();
