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
  const basePrompt = `You are an expert at creating and editing JSON schemas for forms, presentations, and spreadsheets. Your task is to convert natural language descriptions into valid JSON schemas that can be used to generate the requested content.

IMPORTANT RULES:
1. Always return ONLY valid JSON - no markdown, no explanations, no additional text
2. The JSON must be properly formatted and parseable
3. Include appropriate field types, validation rules, and UI hints
4. Make the schema comprehensive but not overly complex
5. Use standard JSON Schema format with additional UI schema for rendering
6. When editing, make ONLY the requested changes and preserve the rest of the structure
7. For edits, carefully analyze the current schema and modify only what the user specifically requests

EDITING BEHAVIOR:
- When you receive a current schema and edit request, preserve all existing content unless specifically asked to change it
- Make minimal, targeted changes based on the user's request
- Maintain the same structure and format as the existing schema
- If adding new elements, follow the same patterns as existing elements`;

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
- Each slide should have: title, subtitle (optional), content (array of bullet points), layout

Valid layout options: BLANK, TITLE, TITLE_AND_BODY, TITLE_AND_TWO_COLUMNS, TITLE_ONLY, SECTION_HEADER, ONE_COLUMN_TEXT, MAIN_POINT

IMPORTANT: Make sure to include meaningful content for each slide with:
- Clear, descriptive titles (required for every slide)
- Relevant subtitles where appropriate  
- Content as an array of bullet points (3-5 points per slide)
- Always include at least 3-5 slides for a complete presentation

Example output for "Marketing Strategy":
{
  "type": "presentation",
  "title": "Marketing Strategy 2024",
  "slides": [
    {
      "title": "Marketing Strategy 2024",
      "subtitle": "Driving Brand Growth Through Digital Innovation",
      "layout": "TITLE"
    },
    {
      "title": "Current Market Analysis",
      "content": [
        "Digital marketing spend increased 25% year-over-year",
        "Social media engagement drives 40% of new customer acquisition",
        "Mobile-first approach is now essential for reach",
        "Video content generates 3x more engagement than static posts"
      ],
      "layout": "TITLE_AND_BODY"
    },
    {
      "title": "Target Audience Insights",
      "content": [
        "Primary demographic: 25-45 years old professionals",
        "Active on LinkedIn, Instagram, and YouTube platforms",
        "Value authentic brand storytelling and transparency",
        "Prefer personalized content and experiences"
      ],
      "layout": "TITLE_AND_BODY"
    },
    {
      "title": "Key Marketing Channels",
      "content": [
        "Social Media Marketing: Focus on video and interactive content",
        "Email Campaigns: Personalized nurture sequences",
        "Content Marketing: Educational blogs and case studies",
        "Paid Advertising: Targeted LinkedIn and Google Ads"
      ],
      "layout": "TITLE_AND_BODY"
    },
    {
      "title": "Success Metrics & Goals",
      "content": [
        "Increase brand awareness by 30% in next 6 months",
        "Generate 500 qualified leads per month",
        "Improve customer engagement rate to 8%",
        "Achieve 25% conversion rate from leads to customers"
      ],
      "layout": "TITLE_AND_BODY"
    }
  ]
}`;

    case 'spreadsheet':
      return `${basePrompt}

For SPREADSHEETS, create a JSON schema with:
- "type": "spreadsheet"
- "title": spreadsheet name
- "sheets": array of sheet objects
- Each sheet has: name, headers (array), rows (array of arrays), formatting (optional)

IMPORTANT: Make sure to include meaningful data with:
- Clear column headers
- Relevant sample data rows
- Optional formatting for column widths

Example output for "Budget Tracker":
{
  "type": "spreadsheet",
  "title": "Budget Tracker 2024",
  "sheets": [
    {
      "name": "Monthly Budget",
      "headers": ["Category", "Budgeted Amount", "Actual Amount", "Difference", "Status"],
      "rows": [
        ["Housing", "$1200", "$1150", "$50", "Under Budget"],
        ["Food", "$400", "$450", "-$50", "Over Budget"],
        ["Transportation", "$300", "$275", "$25", "Under Budget"],
        ["Entertainment", "$200", "$180", "$20", "Under Budget"],
        ["Utilities", "$150", "$145", "$5", "Under Budget"],
        ["Healthcare", "$100", "$120", "-$20", "Over Budget"],
        ["Savings", "$500", "$500", "$0", "On Target"]
      ],
      "formatting": {
        "headerStyle": "bold",
        "columnWidths": [120, 140, 140, 100, 120]
      }
    },
    {
      "name": "Expense Categories",
      "headers": ["Category", "Type", "Priority", "Notes"],
      "rows": [
        ["Rent", "Fixed", "High", "Monthly payment"],
        ["Groceries", "Variable", "High", "Weekly shopping"],
        ["Gas", "Variable", "Medium", "Commute expenses"],
        ["Dining Out", "Variable", "Low", "Entertainment"],
        ["Insurance", "Fixed", "High", "Monthly premium"]
      ],
      "formatting": {
        "headerStyle": "bold",
        "columnWidths": [100, 80, 80, 200]
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
export async function generateFormSchema(prompt, type = 'form', context = null) {
  try {
    // Map frontend types to backend types
    const typeMapping = {
      'ppt': 'presentation',
      'form': 'form',
      'spreadsheet': 'spreadsheet'
    };
    
    const mappedType = typeMapping[type] || type;
    console.log(`🤖 Generating ${mappedType} schema for type: ${type}`);
    
    const systemPrompt = getSystemPrompt(mappedType);
    
    // Build user prompt based on whether we're editing or creating new
    let userPrompt;
    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    if (context && context.isEditing && context.currentSchema) {
      // EDITING MODE: Include conversation history and current schema
      console.log('🔄 Edit mode: Including context and schema');
      
      // Add conversation history to messages
      if (context.conversationHistory && context.conversationHistory.length > 0) {
        // Add the previous conversation messages (excluding the current one)
        const previousMessages = context.conversationHistory.slice(0, -1);
        previousMessages.forEach(msg => {
          if (msg.role === 'user' || msg.role === 'assistant') {
            messages.push({
              role: msg.role,
              content: msg.content
            });
          }
        });
      }

      userPrompt = `EDIT MODE: Based on our previous conversation and the current ${mappedType} schema below, please make the requested changes.

CURRENT SCHEMA:
${JSON.stringify(context.currentSchema, null, 2)}

USER REQUEST: ${prompt}

Please return the updated schema with the requested modifications. Maintain the existing structure and only change what the user specifically requested.

Remember: Return ONLY valid JSON, no additional text or formatting.`;
    } else {
      // CREATION MODE: Fresh start
      console.log('🆕 Creation mode: Fresh start');
      userPrompt = `Create a ${mappedType} based on this description: ${prompt}

Remember: Return ONLY valid JSON, no additional text or formatting.`;
    }

    // Add the current user message
    messages.push({
      role: 'user',
      content: userPrompt
    });

    const response = await openRouterClient.post('/chat/completions', {
      model: MODEL_NAME,
      messages: messages,
      temperature: context && context.isEditing ? 0.1 : 0.3, // Lower temperature for edits to be more conservative
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
