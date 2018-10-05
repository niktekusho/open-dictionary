module.exports = async function (fastify) {
	const {userService} = fastify;

	fastify.get('/', async () => {
		try {
			return userService.getUsers();
		} catch (error) {
			fastify.log.error(error);
		}
	});
};
