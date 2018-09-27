module.exports = async function (fastify) {
	const {userService} = fastify;
	if (userService === null || userService === undefined) {
		throw new Error('User Service must be initialized before the application starts.');
	}
	fastify.post('/', async (req, res) => {
		const {body} = req;
		try {
			await userService.createUser(body);
			return {
				msg: 'User created'
			};
		} catch (error) {
			fastify.log.error(error);
			let statusCode;
			// TODO temporary error handling
			if (error.type && error.type === 'client') {
				statusCode = 406;
			} else {
				statusCode = 500;
			}
			return res.code(statusCode).send(error.details);
		}
	});
};
