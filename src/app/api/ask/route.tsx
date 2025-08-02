import { NextRequest } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { transformStream } from "@crayonai/stream";
import { tools } from "./tools";

const client = new OpenAI({
  baseURL: "https://api.thesys.dev/v1/embed",
  apiKey: process.env.THESYS_API_KEY,
});

export async function POST(req: NextRequest) {
  const { prompt, previousC1Response } = (await req.json()) as {
    prompt: string;
    previousC1Response?: string;
  };

  const messages: ChatCompletionMessageParam[] = [];

  if (previousC1Response) {
    messages.push({
      role: "assistant",
      content: previousC1Response,
    });
  }

  messages.push({
    role: "user",
    content: prompt,
  });

  const runToolsResponse = client.beta.chat.completions.runTools({
    model: "c1/anthropic/claude-3.5-sonnet/v-20250617", // available models: https://docs.thesys.dev/guides/models-pricing#model-table
    messages: [
      {
        role: "system",
        content: `You are a stock market analyst. Answer queries of user based on the tools data.
        Use tools according to the user request and necessity. Multiple tools can be used in a single request.
        Strictly use ticker symbol as input to the tools.
        Use the tools to find information about market trends, stock prices, and other financial data.
        
        Your response MUST always include:
        1. Interactive charts and graphs for visual analysis
        2. A button labeled "Company Overview" that reveals detailed company information
        3. A button labeled "Sentiment Analysis" that shows market sentiment and social media analysis
        
        Format your response using proper HTML/markdown for interactive elements. Make sure charts are responsive
        and buttons are clearly visible and functional. Each section should be collapsible for better user experience.
        `,
      },
      ...messages,
    ],
    stream: true,
    tools: tools,
  });

  const llmStream = await runToolsResponse;

  const responseStream = transformStream(llmStream, (chunk) => {
    return chunk.choices[0]?.delta?.content || "";
  });

  return new Response(responseStream as ReadableStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
