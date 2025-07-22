import { JSONSchema } from "openai/lib/jsonschema.mjs";
import { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const apiClient = {
  trend: async (query: string) => {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&keywords=${encodeURIComponent(
      query
    )}&apikey=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
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
      name: "web_search",
      description:
        "Search the web for a given query, will return details about anything including business",
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
