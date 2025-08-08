export const getHealth = (req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		service: "ctrl-c-ctrl-v-server",
	});
};
