const fastifyPlugin = require('fastify-plugin');

const userAPI = require('../users/user-api');

async function plugin(fastify, opts, next) {
	const {userService} = fastify;
	if (userService === null || userService === undefined) {
		throw new Error('User Service must be initialized before the application starts.')
	}
	const usersRoutes = userAPI(userService);
	fastify.register(usersRoutes, {prefix: '/users'});
	next();
}

module.exports = fastifyPlugin(plugin);
