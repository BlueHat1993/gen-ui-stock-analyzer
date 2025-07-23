import { JSONSchema } from "openai/lib/jsonschema.mjs";
import { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const apiClient = {
  trend: async (query: string) => {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    // console.log("API Key:", apiKey);
    // console.log("Search Query:", query);

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${query}&apikey=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("API request failed");
      console.error("API request failed:", response.statusText);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data
  },
};

export const tools: [
  RunnableToolFunctionWithParse<{
    searchQuery: string;
  }>
] = [
  {
    type: "function",
    function: {
      name: "stock_trend",
      description:
        "Provides market trends based on a search query. Use this to find information about market trends, stock prices, and other financial data.",
      parse: (input) => {
        return JSON.parse(input) as { searchQuery: string };
      },
      parameters: zodToJsonSchema(
        z.object({
          searchQuery: z.string().describe("search query"),
        })
      ) as JSONSchema,
      function: async ({ searchQuery }: { searchQuery: string }) => {
        const results = await apiClient.trend(searchQuery);

        return JSON.stringify(results);
      },
      strict: true,
    },
  },
];
