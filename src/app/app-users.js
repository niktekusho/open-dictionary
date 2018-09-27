const fastifyPlugin = require('fastify-plugin');

const getAllUsersRoute = require('./users/get-users');
const createUserRoute = require('./users/create-user');
const getUserRoute = require('./users/get-user');
const userNotFoundHandler = require('./users/user-not-found-handler');

async function plugin(fastify, opts, next) {
	const {userService} = fastify;
	if (userService === null || userService === undefined) {
		throw new Error('User Service must be initialized before the application starts.');
	}
	const internalOpts = {
		...opts,
		prefix: '/users'
	};

	fastify
		.register(getAllUsersRoute, internalOpts)
		.register(createUserRoute, internalOpts)
		.register(getUserRoute, internalOpts)
		.register(userNotFoundHandler, internalOpts);
	next();
}

module.exports = fastifyPlugin(plugin);
