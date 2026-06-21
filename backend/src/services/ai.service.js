import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "langchain";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const response = await geminiModel.invoke(
    messages.map((msg) => {
      if (msg.role === "user") {
        return new HumanMessage(msg.content);
      } else if (msg.role === "ai") {
        return new AIMessage(msg.content);
      }
    }),
  );

  return response.text;
}

export async function generateChatTittle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`you are a helphul assistant that generates a title for a chat conversation based on the first message of the conversation. The title should be concise and descriptive.
      
      user will provide the first message of the conversation and you will generate a title for the conversation based on that message. The title should be concise and descriptive. The title should not be more than 2-5 words.
      `),
    new HumanMessage(
      `generate a title for a chat conversation based on the following message: ${message}`,
    ),
  ]);

  return response.text;
}

// export async function testAi() {
//   model.invoke("hello, my name is anuj").then((response) => {
//     console.log(response.text);
//   });
// }
