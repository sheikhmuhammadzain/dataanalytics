# Data Analytics Dashboard

A modern data analytics dashboard built with React, Express, and Groq AI. Upload CSV files and analyze your data with AI-powered insights.

## Features

- CSV file upload and parsing
- Data visualization with charts
- AI-powered data analysis chat
- Column statistics and summaries
- Interactive data filtering
- Responsive design

## Tech Stack

- Frontend: React, TypeScript, Tailwind CSS
- Backend: Node.js, Express
- AI: Groq SDK
- Charts: Recharts
- State Management: Zustand
- CSV Parsing: Papa Parse

## Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your Groq API key:
   ```
   GROQ_API_KEY=your_api_key_here
   ```
4. Build the frontend:
   ```bash
   npm run build
   ```
5. Start the server:
   ```bash
   npm start
   ```

## Deployment on Render

1. Fork this repository to your GitHub account

2. Sign up for a free account at [Render.com](https://render.com)

3. Create a new Web Service:
   - Connect your GitHub repository
   - Select the "main" branch
   - Use the following settings:
     - Environment: Node
     - Build Command: `npm install && npm run build`
     - Start Command: `node server.js`

4. Add your environment variable:
   - Key: `GROQ_API_KEY`
   - Value: Your Groq API key

5. Deploy the service

The application will be automatically deployed and available at your Render URL.

## License

MIT 