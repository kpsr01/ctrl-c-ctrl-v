import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

/**
 * Generate form schema from user prompt
 */
export async function generateSchema(prompt, type = 'form') {
  try {
    const response = await api.post('/api/generate-schema', {
      prompt,
      type
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || 'Failed to generate schema');
    } else if (error.request) {
      throw new Error('Unable to connect to the server. Please check if the server is running.');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

/**
 * Test server connection
 */
export async function testServerConnection() {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw new Error('Server is not accessible');
  }
}

/**
 * Test LLM connection
 */
export async function testLLMConnection() {
  try {
    const response = await api.post('/api/test-llm');
    return response.data;
  } catch (error) {
    throw new Error('LLM service is not accessible');
  }
}

export default api;
