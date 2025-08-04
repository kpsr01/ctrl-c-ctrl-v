import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateFormSchema } from './services/llmService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'ctrl-c-ctrl-v-server'
  });
});

// Generate form schema endpoint
app.post('/api/generate-schema', async (req, res) => {
  try {
    const { prompt, type = 'form', context = null } = req.body;

    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({
        error: 'Prompt is required',
        message: 'Please provide a description of the form you want to create'
      });
    }

    console.log(`Generating ${type} schema for prompt:`, prompt);
    if (context) {
      console.log('🔄 Context provided:', {
        isEditing: context.isEditing,
        historyLength: context.conversationHistory?.length || 0,
        hasCurrentSchema: !!context.currentSchema
      });
    }

    const schema = await generateFormSchema(prompt, type, context);

    res.json({
      success: true,
      schema,
      type,
      prompt,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error generating schema:', error);
    
    res.status(500).json({
      error: 'Internal server error',
      message: 'Failed to generate schema. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Test LLM connection endpoint
app.post('/api/test-llm', async (req, res) => {
  try {
    const testPrompt = "Create a simple contact form with name and email fields";
    const schema = await generateFormSchema(testPrompt, 'form');
    
    res.json({
      success: true,
      message: 'LLM connection successful',
      testSchema: schema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'LLM connection failed',
      error: error.message
    });
  }
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🤖 LLM API: http://localhost:${PORT}/api/generate-schema`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;
