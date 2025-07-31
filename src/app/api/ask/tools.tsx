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
    console.log("Called Quote Tool with query:", query);
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
    console.log("Called Monthly Trend Tool with query:", query);
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
    console.log("Called Intra-day Trend Tool with query:", query);
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
    console.log("Called Market Sentiment Tool with query:", query);
    return data;  
  },
  companyOverview: async (query: string) => {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${query}&apikey=${apiKey}`;

    const response = await fetch(url, {
      method: "GET",
    });
 
    if (!response.ok) {
      return response.statusText; // Return the status text for debugging
    }

    const data = await response.json();
    console.log("Called Company Overview tool with query:", query);
    return data;  
  }

};

/**
 * Array of tool functions for stock market analysis:
 * 1. stock_trend_monthly - Get monthly historical data for a stock symbol
 * 2. stock_quote - Get current stock quote and trading information
 * 3. stock_trend_intraday - Get intraday (5-min interval) price data
 * 4. market_sentiment - Get news sentiment analysis for a stock
 */
export const tools: [
  RunnableToolFunctionWithParse<{
    searchQuery: string;
  }>,
  RunnableToolFunctionWithParse<{
    searchQuery: string;
  }>,
  RunnableToolFunctionWithParse<{ searchQuery: string; }>,
  RunnableToolFunctionWithParse<{ searchQuery: string; }>,
   RunnableToolFunctionWithParse<{ searchQuery: string; }>
] = [
        /**
     * Monthly Stock Trend Tool
     * - Returns historical monthly price data for a given stock symbol
     * - Uses TIME_SERIES_MONTHLY AlphaVantage API endpoint
     * - Includes monthly open, high, low, close prices and volume
     * - Useful for long-term trend analysis and historical performance
     */
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
        /**
     * Stock Quote Tool
     * - Returns real-time stock quote data
     * - Uses GLOBAL_QUOTE AlphaVantage API endpoint
     * - Provides current price, volume, high/low, open/close
     * - Best for getting current market snapshot
     */
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
        /**
     * Intraday Stock Trend Tool
     * - Returns high-frequency price data at 5-minute intervals
     * - Uses TIME_SERIES_INTRADAY AlphaVantage API endpoint
     * - Provides detailed price movements throughout trading day
     * - Ideal for day trading analysis and short-term patterns
     */
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
        /**
     * Market Sentiment Analysis Tool
     * - Analyzes news sentiment and market mood for a stock
     * - Uses NEWS_SENTIMENT AlphaVantage API endpoint
     * - Provides sentiment scores from news articles and social media
     * - Helps gauge market perception and potential price movements
     */
    {
      type: "function",
      function: {
        name: "market_sentiment",
        description:
          `Provides market sentiment based on a search query. Use this to find information about
         market sentiment and other financial data.`,
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
    },
        /**
     * Company Overview Tool
     * - Provides detailed company information and financials
     * - Uses OVERVIEW AlphaVantage API endpoint
     * - Includes market cap, P/E ratio, earnings, and more
     * - Useful for fundamental analysis and company research
     */
    {
      type: "function",
      function: {
        name: "company_overview",
        description:
          `Provides company overview based on a search query. Use this to find information about
         company details, stock prices, and other financial data.`,
        parse: (input) => {
          return JSON.parse(input) as { searchQuery: string };
        },
        parameters: zodToJsonSchema(
          z.object({
            searchQuery: z.string().describe("search query"),
          })
        ) as JSONSchema,
        function: async ({ searchQuery }: { searchQuery: string }) => {
          const results = await apiClient.companyOverview(searchQuery);

          return JSON.stringify(results);
        },
        strict: true,
      },
    },
    
  ];
