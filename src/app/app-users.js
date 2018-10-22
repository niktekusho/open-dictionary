const fastifyPlugin = require('fastify-plugin');

const loginRoute = require('./users/login');
const getAllUsersRoute = require('./users/get-users');
const createUserRoute = require('./users/register');
const getUserRoute = require('./users/get-user');
const getUserRolesRoute = require('./users/get-user-roles');

async function plugin(fastify, opts, next) {
	fastify
		.register(getAllUsersRoute, opts)
		.register(createUserRoute, opts)
		.register(getUserRoute, opts)
		.register(getUserRolesRoute, opts)
		.register(loginRoute, opts);

	fastify.setNotFoundHandler((req, res) => {
		const {username} = req.params;
		const {httpErrors} = fastify;
		const error = new httpErrors.NotFound(`User with username ${username} not found.`);
		res.code(404).send({error});
	});

	next();
}

module.exports = fastifyPlugin(plugin);
