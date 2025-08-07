export const validateSchemaRequest = (req, res, next) => {
	const { prompt } = req.body;

	if (!prompt || prompt.trim().length === 0) {
		return res.status(400).json({
			error: "Prompt is required",
			message: "Please provide a description of the form you want to create",
		});
	}

	next();
};
