// // To run this code you need to install the following dependencies:
// // npm install @google/genai mime
// // npm install -D @types/node

import {
  GoogleGenAI,
} from '@google/genai';

async function runChat(prompt) {
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyC6QZlOLhmVsVZRDT1HwoYO6gDCa_d1yk4",
  });
  const tools = [
    {
      googleSearch: {
      }
    },
  ];
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    tools,
  };
  const model = 'gemini-2.5-pro';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: prompt,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let fullText = '';

  for await (const chunk of response) {
    fullText += chunk.text;
  }

  return fullText;
}

export default runChat;


