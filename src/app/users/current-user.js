module.exports = async function (fastify) {
	const {httpErrors} = fastify;

	fastify.get('/me',
		{beforeHandler: [fastify.authenticate]},
		async (request, reply) => {
			fastify.log.debug(request);
			if (request.user) {
				const {username} = request.user;
				return reply.redirect(`./${username}`);
			}
			// User not found
			throw new httpErrors.Unauthorized('You have to log in first.');
		}
	);
};
