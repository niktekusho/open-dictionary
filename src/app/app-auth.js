const fastifyPlugin = require('fastify-plugin');

const loginRoute = require('./auth/login');

async function plugin(fastify, opts, next) {
	const {userService} = fastify;
	if (userService === null || userService === undefined) {
		throw new Error('User Service must be initialized before the application starts.');
	}

	fastify.register(loginRoute, opts);

	next();
}

module.exports = fastifyPlugin(plugin);
