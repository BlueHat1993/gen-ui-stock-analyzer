import { JSONSchema } from "openai/lib/jsonschema.mjs";
import { RunnableToolFunctionWithParse } from "openai/lib/RunnableFunction.mjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const apiClient = {
  quote: async (query: string) => {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${query}&apikey=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
        return response.statusText; // Return the status text for debugging
    }

    const data = await response.json();
    console.log("Called quote with query:", query);
    return data;
  },
  monthlyTrend: async (query: string) => {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    // console.log("API Key:", apiKey);
    // console.log("Search Query:", query);

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_MONTHLY&symbol=${query}&apikey=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      return response.statusText; // Return the status text for debugging
      
    }

    const data = await response.json();
    console.log("Called monthly trend with query:", query);
    return data
  },
  intradayTrend: async (query: string) => {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    // console.log("API Key:", apiKey);
    // console.log("Search Query:", query);

    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${query}&interval=5min&apikey=${apiKey}`;;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      return response.statusText; // Return the status text for debugging
    }

    const data = await response.json();
    console.log("Called intraday with query:", query);
    return data
  },
  marketSentiment: async (query: string) => {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=${query}&apikey=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      return response.statusText; // Return the status text for debugging
    }

    const data = await response.json();
    console.log("Called Market Sentiment with query:", query);
    return data;  
  }

};

export const tools: [
  RunnableToolFunctionWithParse<{
    searchQuery: string;
  }>,
  RunnableToolFunctionWithParse<{
    searchQuery: string;
  }>,
  RunnableToolFunctionWithParse<{ searchQuery: string; }>,
  RunnableToolFunctionWithParse<{ searchQuery: string; }>
] = [
    {
      type: "function",
      function: {
        name: "stock_trend_monthly",
        description:
          `Provides monthly market trends based on a search query. Use this to find information about
         monthly market trends, stock prices, and other financial data.`,
        parse: (input) => {
          return JSON.parse(input) as { searchQuery: string };
        },
        parameters: zodToJsonSchema(
          z.object({
            searchQuery: z.string().describe("search query"),
          })
        ) as JSONSchema,
        function: async ({ searchQuery }: { searchQuery: string }) => {
          const results = await apiClient.monthlyTrend(searchQuery);

          return JSON.stringify(results);
        },
        strict: true,
      },
    },
    {
      type: "function",
      function: {
        name: "stock_quote",
        description:
          `Provides stock quotes based on a search query. 
        Use this to find information about stock prices and other financial data.`,
        parse: (input) => {
          return JSON.parse(input) as { searchQuery: string };
        },
        parameters: zodToJsonSchema(
          z.object({
            searchQuery: z.string().describe("search query"),
          })
        ) as JSONSchema,
        function: async ({ searchQuery }: { searchQuery: string }) => {
          const results = await apiClient.quote(searchQuery);

          return JSON.stringify(results);
        },
        strict: true,
      },
    },
    {
      type: "function",
      function: {
        name: "stock_trend_intraday",
        description:
          `Provides intraday market trends based on a search query. Use this to find information about
         intraday market trends, stock prices, and other financial data.`,
        parse: (input) => {
          return JSON.parse(input) as { searchQuery: string };
        },
        parameters: zodToJsonSchema(
          z.object({
            searchQuery: z.string().describe("search query"),
          })
        ) as JSONSchema,
        function: async ({ searchQuery }: { searchQuery: string }) => {
          const results = await apiClient.intradayTrend(searchQuery);

          return JSON.stringify(results);
        },
        strict: true,
      },
    },
    {
      type: "function",
      function: {
        name: "market_sentiment",
        description:
          `Provides market sentiment based on a search query. Use this to find information about
         market trends, stock prices, and other financial data.`,
        parse: (input) => {
          return JSON.parse(input) as { searchQuery: string };
        },
        parameters: zodToJsonSchema(
          z.object({
            searchQuery: z.string().describe("search query"),
          })
        ) as JSONSchema,
        function: async ({ searchQuery }: { searchQuery: string }) => {
          const results = await apiClient.marketSentiment(searchQuery);

          return JSON.stringify(results);
        },
        strict: true,
      },
    }
  ];
