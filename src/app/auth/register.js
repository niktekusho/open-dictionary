module.exports = async function (fastify, opts) {
	const {errors, userService} = fastify;
	// if opts contains a prefix, use that without additional resources
	const route = (opts && opts.prefix) ? '/' : '/register';
	fastify.post(route, async (req, res) => {
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
