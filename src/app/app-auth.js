const fastifyPlugin = require('fastify-plugin');

const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

async function plugin(fastify, opts, next) {
	const {errors, userService} = fastify;
	if (userService === null || userService === undefined) {
		errors.throwServerError(null, 'User Service must be initialized before the application starts.');
	}

	fastify
		.register(loginRoute, opts)
		.register(registerRoute, opts);

	next();
}

module.exports = fastifyPlugin(plugin);
