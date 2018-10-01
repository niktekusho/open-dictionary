const fastifyPlugin = require('fastify-plugin');

const getAllUsersRoute = require('./users/get-users');
const createUserRoute = require('./users/create-user');
const getUserRoute = require('./users/get-user');

async function plugin(fastify, opts, next) {
	const {userService} = fastify;
	if (userService === null || userService === undefined) {
		throw new Error('User Service must be initialized before the application starts.');
	}

	fastify
		.register(getAllUsersRoute, opts)
		.register(createUserRoute, opts)
		.register(getUserRoute, opts);


	fastify.setNotFoundHandler((req, res) => {
		const {username} = req.params;
		const {httpErrors} = fastify;
		const error = new httpErrors.NotFound(`User with username ${username} not found.`);
		res.code(404).send({error});
	});

	next();
}

module.exports = fastifyPlugin(plugin);
