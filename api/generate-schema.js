import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = 'gemini-2.5-flash';

if (!GEMINI_API_KEY) {
  console.error('⚠️  GEMINI_API_KEY not found in environment variables');
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generate system prompt based on content type
 */
function getSystemPrompt(type, theme = null) {
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
      let presentationPrompt = `${basePrompt}

For PRESENTATIONS, create a JSON schema with:
- "type": "presentation"
- "title": presentation title
- "slides": array of slide objects
- Each slide should have: title, subtitle (optional), content (array of bullet points), layout, colors (object), fonts (object)

Valid layout options: BLANK, TITLE, TITLE_AND_BODY, TITLE_AND_TWO_COLUMNS, TITLE_ONLY, SECTION_HEADER, ONE_COLUMN_TEXT, MAIN_POINT

IMPORTANT: Make sure to include meaningful content for each slide with:
- Clear, descriptive titles (required for every slide)
- Relevant subtitles where appropriate  
- Content as an array of bullet points (3-5 points per slide)
- Always include at least 3-5 slides for a complete presentation
- Colors and fonts that match the requested theme
- Rich visual styling based on theme`;

      // Add theme-specific styling instructions
      if (theme) {
        presentationPrompt += `

THEME: ${theme.toUpperCase()}
You must creatively design the visual styling for the "${theme}" theme. You have complete freedom to choose appropriate:

COLORS - Design a cohesive color palette with:
- "primary": main brand color (hex format like "#2563eb")  
- "secondary": supporting color for subtitles and accents
- "accent": highlight color for important elements
- "background": slide background color
- "text": main text color

FONTS - Choose typography that matches the theme:
- "heading": font family for titles (e.g., "Arial Black", "Times New Roman", "Impact", "Georgia", "Helvetica Neue", "Comic Sans MS")
- "body": font family for content and subtitles
- "size": object with "title" (28-40px), "subtitle" (20-30px), "content" (14-24px) font sizes

STYLE GUIDELINES:
- Professional: Corporate, clean, minimal, business-appropriate
- Creative: Bold, artistic, vibrant, experimental, colorful  
- Academic: Scholarly, formal, research-oriented, traditional
- Modern: Sleek, contemporary, trendy, tech-forward
- Elegant: Sophisticated, luxurious, refined, premium
- Playful: Fun, engaging, colorful, casual, energetic

IMPORTANT: Include these styling properties in EVERY slide:
"colors": { your chosen color palette },
"fonts": { your chosen typography settings }

Make creative decisions that truly capture the essence of the "${theme}" theme!`;
      }

      presentationPrompt += `

Example output for "Marketing Strategy" (showing how you should creatively choose theme styling):
{
  "type": "presentation",
  "title": "Marketing Strategy 2024",
  "theme": "professional",
  "slides": [
    {
      "title": "Marketing Strategy 2024",
      "subtitle": "Driving Brand Growth Through Digital Innovation",
      "layout": "TITLE",
      "colors": {
        "primary": "#your_chosen_primary_color",
        "secondary": "#your_chosen_secondary_color", 
        "accent": "#your_chosen_accent_color",
        "background": "#your_chosen_background_color",
        "text": "#your_chosen_text_color"
      },
      "fonts": {
        "heading": "Your_Chosen_Heading_Font",
        "body": "Your_Chosen_Body_Font",
        "size": {
          "title": your_chosen_title_size,
          "subtitle": your_chosen_subtitle_size,
          "content": your_chosen_content_size
        }
      }
    }
  ]
}

REMEMBER: Replace the placeholder values with your creative choices that match the theme!`;

      return presentationPrompt;

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
        ["Food", "$400", "$450", "-$50", "Over Budget"]
      ],
      "formatting": {
        "headerStyle": "bold",
        "columnWidths": [120, 140, 140, 100, 120]
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
async function generateFormSchema(prompt, type = 'form', context = null) {
  try {
    // Map frontend types to backend types
    const typeMapping = {
      'ppt': 'presentation',
      'form': 'form',
      'spreadsheet': 'spreadsheet'
    };
    
    const mappedType = typeMapping[type] || type;
    const theme = context?.theme;
    
    console.log(`🤖 Generating ${mappedType} schema for type: ${type}${theme ? ` with theme: ${theme}` : ''}`);
    
    const systemPrompt = getSystemPrompt(mappedType, theme);
    
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

    // Create a single prompt for Gemini by combining system prompt and user prompt
    let fullPrompt = systemPrompt + '\n\n' + userPrompt;
    
    // If we have conversation history, include it
    if (context && context.conversationHistory && context.conversationHistory.length > 1) {
      const historyText = context.conversationHistory.slice(0, -1).map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      fullPrompt = systemPrompt + '\n\nConversation History:\n' + historyText + '\n\nCurrent Request:\n' + userPrompt;
    }

    // Get Gemini model and generate content
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const generationConfig = {
      temperature: context && context.isEditing ? 0.1 : 0.3,
      topP: 0.9,
      maxOutputTokens: 2000,
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig,
    });

    const aiResponse = result.response.text();
    
    if (!aiResponse) {
      throw new Error('No response from Gemini');
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
    
    if (error.message && error.message.includes('API_KEY')) {
      throw new Error('Gemini API key is invalid or missing. Please check your environment variables.');
    } else if (error.message && error.message.includes('quota')) {
      throw new Error('Gemini API quota exceeded. Please try again later.');
    } else if (error.message && error.message.includes('network')) {
      throw new Error('Failed to connect to Gemini API. Please check your internet connection.');
    } else {
      // Other error
      throw new Error(`Gemini AI Service Error: ${error.message}`);
    }
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
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

      res.status(200).json({
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
