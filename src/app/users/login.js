module.exports = async function (fastify) {
	const {userService} = fastify;
	if (userService === null || userService === undefined) {
		throw new Error('User Service must be initialized before the application starts.');
	}
	fastify.post('/login', async req => {
		const {username, password} = req.body;
		try {
			await userService.authenticate(username, password);
		} catch (error) {
			fastify.log.error(error);
		}
	});
};
