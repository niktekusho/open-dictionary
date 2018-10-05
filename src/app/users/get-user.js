module.exports = async function (fastify) {
	const {userService, httpErrors} = fastify;

	fastify.get('/:username', async req => {
		const {username} = req.params;
		let serviceResult = null;
		try {
			serviceResult = await userService.findUserByUsername(username);
		} catch (error) {
			fastify.log.error(error);
			throw new httpErrors.InternalServerError();
		}
		if (serviceResult) {
			return serviceResult;
		}
		// User not found
		throw new httpErrors.NotFound(`User with username ${username} not found.`);
	});
};
