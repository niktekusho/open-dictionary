module.exports = async function (fastify) {
	const {httpErrors} = fastify;

	fastify.get('/me',
		{beforeHandler: [fastify.authenticate]},
		async (request, reply) => {
			if (request.user) {
				// TODO log.debug not working
				fastify.log.info(request.user);
				const {username} = request.user;
				return reply.redirect(`./${username}`);
			}
			// User not found
			throw new httpErrors.Unauthorized('You have to log in first.');
		}
	);
};
