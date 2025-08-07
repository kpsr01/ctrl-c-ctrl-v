import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import {
	getSystemPrompt,
	buildUserPrompt,
} from "../prompts/promptTemplates.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../../.env") });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-flash"; // or 'gemini-1.5-pro' for more complex tasks

if (!GEMINI_API_KEY) {
	console.error("!  GEMINI_API_KEY not found in environment variables");
}

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

/**
 * Generate form schema using Gemini AI
 */
export async function generateFormSchema(
	prompt,
	type = "form",
	context = null,
) {
	try {
		// Map frontend types to backend types
		const typeMapping = {
			ppt: "presentation",
			form: "form",
			spreadsheet: "spreadsheet",
		};

		const mappedType = typeMapping[type] || type;
		const theme = context?.theme;

		console.log(
			`🤖 Generating ${mappedType} schema for type: ${type}${theme ? ` with theme: ${theme}` : ""}`,
		);

		const model = genAI.getGenerativeModel({ model: MODEL_NAME });

		// Build the conversation history
		const chatHistory = [];

		if (context && context.isEditing && context.conversationHistory) {
			// Convert conversation history to Gemini format
			context.conversationHistory.forEach((msg) => {
				if (msg.role === "user") {
					chatHistory.push({
						role: "user",
						parts: [{ text: msg.content }],
					});
				} else if (msg.role === "assistant") {
					chatHistory.push({
						role: "model",
						parts: [{ text: msg.content }],
					});
				}
			});
		}

		// Create the chat session
		const chat = model.startChat({
			history: chatHistory,
			generationConfig: {
				temperature: context && context.isEditing ? 0.1 : 0.3,
				topK: 40,
				topP: 0.95,
				maxOutputTokens: 131072,
			},
		});

		// Build the prompt
		const systemPrompt = getSystemPrompt(mappedType, theme);
		const userPrompt = buildUserPrompt(prompt, type, context);

		// For new conversations, include system prompt with user prompt
		const fullPrompt =
			chatHistory.length === 0
				? `${systemPrompt}\n\n${userPrompt}`
				: userPrompt;

		console.log("🔍 Sending prompt to Gemini...");

		const result = await chat.sendMessage(fullPrompt);
		const response = await result.response;
		const aiResponse = response.text();

		if (!aiResponse) {
			throw new Error("No response from Gemini");
		}

		console.log("🔍 Raw Gemini Response:", aiResponse);

		// Clean the response - remove markdown formatting if present
		let cleanedResponse = aiResponse.trim();

		// Remove markdown code blocks if present
		if (cleanedResponse.startsWith("```json")) {
			cleanedResponse = cleanedResponse.replace(/^```json\s*/, "");
		}
		if (cleanedResponse.startsWith("```")) {
			cleanedResponse = cleanedResponse.replace(/^```\s*/, "");
		}
		if (cleanedResponse.endsWith("```")) {
			cleanedResponse = cleanedResponse.replace(/\s*```$/, "");
		}

		// Try to parse the JSON
		let schema;
		try {
			schema = JSON.parse(cleanedResponse);
		} catch (parseError) {
			console.error("❌ JSON Parse Error:", parseError);
			console.error("🔍 Cleaned Response:", cleanedResponse);

			// Fallback: Try to extract JSON from the response
			const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
			if (jsonMatch) {
				schema = JSON.parse(jsonMatch[0]);
			} else {
				throw new Error(`Failed to parse JSON response: ${parseError.message}`);
			}
		}

		// Validate the schema structure
		if (!schema || typeof schema !== "object") {
			throw new Error("Invalid schema structure received from Gemini");
		}

		console.log("✅ Schema generated successfully");
		return schema;
	} catch (error) {
		console.error("❌ Error in generateFormSchema:", error);

		if (error.message?.includes("API_KEY")) {
			throw new Error("Gemini API key is invalid or missing");
		} else if (error.message?.includes("quota")) {
			throw new Error("Gemini API quota exceeded. Please try again later.");
		} else if (error.message?.includes("RATE_LIMIT")) {
			throw new Error("Rate limit exceeded. Please try again in a moment.");
		} else {
			throw new Error(`Gemini Service Error: ${error.message}`);
		}
	}
}

/**
 * Test the Gemini connection
 */
export async function testConnection() {
	try {
		const model = genAI.getGenerativeModel({ model: MODEL_NAME });

		const result = await model.generateContent(
			"Hello, respond with just 'Connection successful'",
		);
		const response = await result.response;
		const text = response.text();

		console.log("✅ Gemini connection successful:", text);
		return true;
	} catch (error) {
		console.error("❌ Gemini connection failed:", error.message);
		return false;
	}
}
