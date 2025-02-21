import express from 'express';
import { Groq } from 'groq-sdk';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(join(__dirname, 'dist')));

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, context } = req.body;

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a data analysis assistant. You help users understand their CSV data. Here's the context about the current data: ${context}`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "deepseek-r1-distill-qwen-32b",
      temperature: 0.7,
      max_tokens: 1000,
      stream: true, // Enable streaming
    });

    // Stream the response
    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to get chat completion' });
  }
});

// Handle SPA routing - serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 