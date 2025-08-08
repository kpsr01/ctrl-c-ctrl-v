# Schema Generator API

Express.js API server that generates JSON schemas for forms, presentations, and spreadsheets using Google's Gemini AI.

## Base URL
```
http://localhost:3001
```

## Endpoints

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "service": "ctrl-c-ctrl-v-server"
}
```

### Generate Schema
```http
POST /api/generate-schema
```

**Request Body:**
```json
{
  "prompt": "Create a contact form with name and email",
  "type": "form",
  "context": {
    "isEditing": false,
    "theme": "professional",
    "currentSchema": {},
    "conversationHistory": []
  }
}
```

**Parameters:**
- `prompt` (required): Description of what to create
- `type` (optional): `form`, `ppt`, or `spreadsheet` (default: `form`)
- `context` (optional): For editing existing schemas

**Response:**
```json
{
  "success": true,
  "schema": { /* Generated JSON schema */ },
  "type": "form",
  "prompt": "Create a contact form...",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Test LLM Connection
```http
POST /api/test-llm
```

**Response:**
```json
{
  "success": true,
  "message": "Gemini LLM connection successful",
  "testSchema": { /* Test schema */ }
}
```

## Schema Types

### Form Schema
Returns JSON Schema with:
- Standard JSON Schema properties
- UI schema for rendering
- Validation rules

### Presentation Schema
Returns structure with:
- Slides array
- Layout options
- Theme-based styling
- Color and font configuration

### Spreadsheet Schema
Returns structure with:
- Multiple sheets
- Headers and data rows
- Formatting options

## Environment Variables

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Error Responses

```json
{
  "error": "Error type",
  "message": "Human readable message",
  "details": "Additional details (dev only)"
}
```

Common status codes:
- `400`: Invalid request/missing prompt
- `404`: Route not found
- `500`: Server/AI service error
