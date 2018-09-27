module.exports = async function (fastify) {
	const {userService} = fastify;
	if (userService === null || userService === undefined) {
		throw new Error('User Service must be initialized before the application starts.');
	}
	fastify.get('/', async () => {
		try {
			return userService.getUsers();
		} catch (error) {
			fastify.log.error(error);
		}
	});
};
