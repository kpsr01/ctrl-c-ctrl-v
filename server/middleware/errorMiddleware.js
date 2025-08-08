export const notFoundHandler = (req, res) => {
	res.status(404).json({
		error: "Not Found",
		message: `Route ${req.originalUrl} not found`,
	});
};

export const errorHandler = (error, req, res, next) => {
	console.error("Global error handler:", error);
	res.status(500).json({
		error: "Internal Server Error",
		message: "Something went wrong on the server",
	});
};
