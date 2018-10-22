module.exports = async function (fastify) {
	const {emailService, userService} = fastify;
	fastify.post('/', async (req, res) => {
		const {body} = req;
		try {
			await userService.createUser(body, emailService);
			return res.code(201).send({
				msg: 'User created'
			});
		} catch (error) {
			fastify.log.error(error);
			let statusCode;
			// TODO temporary error handling
			if (error.type && error.type === 'client') {
				statusCode = 406;
			} else {
				statusCode = 500;
			}
			return res.code(statusCode).send(error.message);
		}
	});
};
