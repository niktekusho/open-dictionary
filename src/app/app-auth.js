const fastifyPlugin = require('fastify-plugin');

const loginRoute = require('./auth/login');
const registerRoute = require('./auth/register');

async function plugin(fastify, opts, next) {
	fastify
		.register(loginRoute, opts)
		.register(registerRoute, opts);

	next();
}

module.exports = fastifyPlugin(plugin);
