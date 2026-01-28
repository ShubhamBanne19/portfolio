import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS Configuration - Allow requests from your portfolio domain
const corsOptions = {
  origin: [
    'http://localhost:4200',           // Local development
    'http://localhost:3000',           // Alternative local
    'https://shubhambanne19.github.io', // GitHub Pages
    'https://shubhambanne19.github.io/portfolio' // With /portfolio path
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Mistral API Proxy
app.post('/api/mistral', async (req: Request, res: Response) => {
  try {
    const { messages, model = 'mistral-small-latest', temperature = 0.2 } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Check API key is configured
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Mistral API key not configured' });
    }

    // Call Mistral API
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model,
        messages,
        temperature,
        max_tokens: 300,
        top_p: 0.9
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('Mistral API error:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data?.message || 'API request failed',
        status: error.response.status
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// OpenRouter API Proxy
app.post('/api/openrouter', async (req: Request, res: Response) => {
  try {
    const { messages, model = 'openai/gpt-3.5-turbo', temperature = 0.7 } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Check API key is configured
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'OpenRouter API key not configured' });
    }

    // Call OpenRouter API
    const response = await axios.post(
      'https://openrouter.io/api/v1/chat/completions',
      {
        model,
        messages,
        temperature,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.OPENROUTER_REFERER || 'https://github.com/ShubhamBanne19/portfolio'
        },
        timeout: 30000
      }
    );

    res.json(response.data);
  } catch (error: any) {
    console.error('OpenRouter API error:', error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data?.message || 'API request failed',
        status: error.response.status
      });
    }

    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Generic proxy endpoint for testing
app.post('/api/proxy', async (req: Request, res: Response) => {
  try {
    const { url, headers, data } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const response = await axios.post(url, data, {
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    res.json(response.data);
  } catch (error: any) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `The endpoint ${req.path} does not exist`
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔒 CORS enabled for: ${corsOptions.origin.join(', ')}`);
});
