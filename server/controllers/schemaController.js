import {
	generateFormSchema,
	testConnection,
} from "../services/geminiService.js";

export const generateSchema = async (req, res) => {
	try {
		const { prompt, type = "form", context = null } = req.body;

		console.log(`Generating ${type} schema for prompt:`, prompt);

		if (context) {
			console.log("🔄 Context provided:", {
				isEditing: context.isEditing,
				historyLength: context.conversationHistory?.length || 0,
				hasCurrentSchema: !!context.currentSchema,
			});
		}

		const schema = await generateFormSchema(prompt, type, context);

		res.json({
			success: true,
			schema,
			type,
			prompt,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error generating schema:", error);

		res.status(500).json({
			error: "Internal server error",
			message: "Failed to generate schema. Please try again.",
			details:
				process.env.NODE_ENV === "development" ? error.message : undefined,
		});
	}
};

export const testLlm = async (req, res) => {
	try {
		const testPrompt =
			"Create a simple contact form with name and email fields";
		const schema = await generateFormSchema(testPrompt, "form");

		res.json({
			success: true,
			message: "Gemini LLM connection successful",
			testSchema: schema,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Gemini LLM connection failed",
			error: error.message,
		});
	}
};
