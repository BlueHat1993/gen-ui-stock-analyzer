# 📊 Gen UI Stock Analyzer

**Gen UI Stock Analyzer** is a modern, AI-powered stock market analysis tool built using Generative UI and large language models (LLMs). It enables users to query and visualize stock data in real time using natural language, with rich interactivity and dynamic UI components like charts, sentiment indicators, and company overviews.

> 🚀 Built with cutting-edge LLMs and UI frameworks for a seamless, conversational stock analysis experience.

---

## ✨ Features

- 💻 **Generative UI** – Built using thesys.dev C1 API and Next JS the tool generates UI on the go.
- 🔍 **Natural Language Stock Queries** – Ask about any listed stock using simple english
- 📈 **Interactive Charts** – View real-time trends in a clean, responsive format.
- 🧐 **Company Overview & Sentiment Buttons** – Instantly retrieve a summary or sentiment analysis of a company.
- ⚡ **Streaming Responses** – Get dynamic, LLM-generated insights as they process.


---

## 🧰 Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or later)
- npm or [Yarn](https://yarnpkg.com/)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/BlueHat1993/gen-ui-stock-analyzer.git
cd gen-ui-stock-analyzer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

- Copy the example `.env` template and set your API keys:

```bash
cp .env.template .env
```

- Open the `.env` file and provide values for:

```env
THESYS_API_KEY=your_thesys_api_key_here
ALPHAVANTAGE_API_KEY=your_alphavantage_api_key_here
```

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

Visit the app at: [http://localhost:3000](http://localhost:3000)

---

## 💡 How to Use

1. Type a question like “Show me the latest stock trend for AAPL” in the input field.
2. Visualize results via dynamic charts.
3. Click the **Company Overview** or **Sentiment Analysis** buttons to explore deeper insights.

---

## 🗂️ Project Structure

```
gen-ui-stock-analyzer/
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── ask/
│   │       ├── route.tsx
│   │       └── tools.tsx
│   └── home/
│       ├── api.ts
│       ├── HomePage.tsx
│       ├── Loader.tsx
│       └── uiState.tsx
├── .env.template
├── .gitignore
├── README.md
├── package.json
├── tsconfig.json
├── next.config.ts
├── eslint.config.mjs
├── postcss.config.mjs
└── test.js
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!\
Feel free to open an issue or submit a pull request.

---

## 📬 Contact

For questions or suggestions, please reach out via GitHub Issues or contact the maintainer directly.

