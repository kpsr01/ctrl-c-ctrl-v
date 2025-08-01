import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

const OPENROUTER_API_URL = process.env.OPENROUTER_API_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL_NAME = 'meta-llama/llama-3.3-70b-instruct:free';

if (!OPENROUTER_API_KEY) {
  console.error('⚠️  OPENROUTER_API_KEY not found in environment variables');
}

// Create axios instance for OpenRouter
const openRouterClient = axios.create({
  baseURL: OPENROUTER_API_URL,
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': 'http://localhost:5173',
    'X-Title': 'Ctrl-C-Ctrl-V Form Generator'
  },
  timeout: 30000 // 30 second timeout
});

/**
 * Generate system prompt based on content type
 */
function getSystemPrompt(type) {
  const basePrompt = `You are an expert at creating JSON schemas for forms, presentations, and spreadsheets. Your task is to convert natural language descriptions into valid JSON schemas that can be used to generate the requested content.

IMPORTANT RULES:
1. Always return ONLY valid JSON - no markdown, no explanations, no additional text
2. The JSON must be properly formatted and parseable
3. Include appropriate field types, validation rules, and UI hints
4. Make the schema comprehensive but not overly complex
5. Use standard JSON Schema format with additional UI schema for rendering`;

  switch (type) {
    case 'form':
      return `${basePrompt}

For FORMS, create a JSON schema with:
- "type": "object"
- "properties": object with field definitions
- "required": array of required field names
- "uiSchema": object with UI rendering hints
- "title": descriptive title for the form

Field types available: string, number, integer, boolean, array, object  
UI widgets: text, textarea, email, password, number, checkbox, radio, select, date, time, file

Example output for "Job Application Form":
{
  "type": "object",
  "title": "Job Application Form",
  "properties": {
    "fullName": {
      "type": "string",
      "title": "Full Name",
      "minLength": 2
    },
    "email": {
      "type": "string",
      "title": "Email Address",
      "format": "email"
    },
    "phone": {
      "type": "string",
      "title": "Phone Number"
    },
    "resume": {
      "type": "string",
      "title": "Resume (PDF or DOCX)",
      "contentMediaType": "application/pdf"
    },
    "position": {
      "type": "string",
      "title": "Position Applying For",
      "enum": ["Frontend Developer", "Backend Developer", "UI/UX Designer", "Product Manager"]
    },
    "experience": {
      "type": "number",
      "title": "Years of Experience",
      "minimum": 0
    },
    "availableStartDate": {
      "type": "string",
      "format": "date",
      "title": "Available Start Date"
    },
    "relocate": {
      "type": "boolean",
      "title": "Willing to Relocate?"
    }
  },
  "required": ["fullName", "email", "resume", "position"],
  "uiSchema": {
    "fullName": {
      "ui:widget": "text",
      "ui:placeholder": "Enter your full name"
    },
    "email": {
      "ui:widget": "email",
      "ui:placeholder": "example@domain.com"
    },
    "phone": {
      "ui:widget": "text",
      "ui:placeholder": "+1 555-1234"
    },
    "resume": {
      "ui:widget": "file"
    },
    "position": {
      "ui:widget": "select"
    },
    "experience": {
      "ui:widget": "number",
      "ui:placeholder": "e.g. 3"
    },
    "availableStartDate": {
      "ui:widget": "date"
    },
    "relocate": {
      "ui:widget": "checkbox"
    }
  }
}`;

    case 'presentation':
      return `${basePrompt}

For PRESENTATIONS, create a JSON schema with:
- "type": "presentation"
- "title": presentation title
- "slides": array of slide objects
- Each slide has: title, content, layout, styling

Example output:
{
  "type": "presentation",
  "title": "Sample Presentation",
  "slides": [
    {
      "id": 1,
      "type": "title",
      "title": "Main Title",
      "subtitle": "Subtitle text",
      "layout": "title-slide"
    },
    {
      "id": 2,
      "type": "content",
      "title": "Content Slide",
      "content": ["Point 1", "Point 2", "Point 3"],
      "layout": "bullet-points"
    }
  ]
}`;

    case 'spreadsheet':
      return `${basePrompt}

For SPREADSHEETS, create a JSON schema with:
- "type": "spreadsheet"
- "title": spreadsheet name
- "sheets": array of sheet objects
- Each sheet has: name, headers, rows, formatting

Example output:
{
  "type": "spreadsheet",
  "title": "Sample Spreadsheet",
  "sheets": [
    {
      "name": "Sheet1",
      "headers": ["Name", "Email", "Status"],
      "rows": [
        ["John Doe", "john@example.com", "Active"],
        ["Jane Smith", "jane@example.com", "Pending"]
      ],
      "formatting": {
        "headerStyle": "bold",
        "columnWidths": [150, 200, 100]
      }
    }
  ]
}`;

    default:
      return basePrompt;
  }
}

/**
 * Generate form schema using OpenRouter LLM
 */
export async function generateFormSchema(prompt, type = 'form') {
  try {
    console.log(`🤖 Generating ${type} schema`);
    
    const systemPrompt = getSystemPrompt(type);
    const userPrompt = `Create a ${type} based on this description: ${prompt}

Remember: Return ONLY valid JSON, no additional text or formatting.`;

    const response = await openRouterClient.post('/chat/completions', {
      model: MODEL_NAME,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const aiResponse = response.data.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from LLM');
    }

    console.log('🔍 Raw LLM Response:', aiResponse);

    // Clean the response - remove markdown formatting if present
    let cleanedResponse = aiResponse.trim();
    
    // Remove markdown code blocks if present
    if (cleanedResponse.startsWith('```json')) {
      cleanedResponse = cleanedResponse.replace(/^```json\s*/, '');
    }
    if (cleanedResponse.startsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/^```\s*/, '');
    }
    if (cleanedResponse.endsWith('```')) {
      cleanedResponse = cleanedResponse.replace(/\s*```$/, '');
    }

    // Try to parse the JSON
    let schema;
    try {
      schema = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      console.error('🔍 Cleaned Response:', cleanedResponse);
      
      // Fallback: Try to extract JSON from the response
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        schema = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error(`Failed to parse JSON response: ${parseError.message}`);
      }
    }

    // Validate the schema structure
    if (!schema || typeof schema !== 'object') {
      throw new Error('Invalid schema structure received from LLM');
    }

    console.log('✅ Schema generated successfully');
    return schema;

  } catch (error) {
    console.error('❌ Error in generateFormSchema:', error);
    
    if (error.response) {
      // OpenRouter API error
      console.error('API Response Status:', error.response.status);
      console.error('API Response Data:', error.response.data);
      throw new Error(`OpenRouter API Error: ${error.response.data?.error?.message || error.response.statusText}`);
    } else if (error.request) {
      // Network error
      console.error('Network Error:', error.message);
      throw new Error('Failed to connect to OpenRouter API. Please check your internet connection.');
    } else {
      // Other error
      throw new Error(`LLM Service Error: ${error.message}`);
    }
  }
}

/**
 * Test the LLM connection
 */
export async function testConnection() {
  try {
    const response = await openRouterClient.get('/models');
    console.log('✅ OpenRouter connection successful');
    return true;
  } catch (error) {
    console.error('❌ OpenRouter connection failed:', error.message);
    return false;
  }
}
