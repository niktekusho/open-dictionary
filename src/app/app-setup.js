const fastifyPlugin = require('fastify-plugin');
const mongodb = require('mongodb');
const httpErrors = require('http-errors');
const fastifyJWT = require('fastify-jwt');
const fastifyAuth = require('fastify-auth');

const userRepositoryFactory = require('../users/repository');
const userServiceFactory = require('../users/service/user-service');
const userConfig = require('../config/user-config');
const utils = require('../utils');

async function setup(fastify, opts, next) {
	const mongoUrl = utils.buildMongoUrl(userConfig);
	// Create the user repository obj (connection is handled inside) and assign it to the fastify instance
	// TODO use a different logger
	const userRepository = await userRepositoryFactory(mongodb, mongoUrl, console, utils);
	fastify.decorate('userRepository', userRepository);
	// Create the user service obj and assign it to the fastify instance
	// TODO use a different logger
	const userService = await userServiceFactory(userRepository, console);
	fastify.decorate('userService', userService);

	// Add the http-errors module to the fastify instance
	fastify.decorate('httpErrors', httpErrors);

	// Use a sane JWT secret... even though it SHOULD USE the env var!
	const secret = process.env.OD_SECRET || 'open_Dictionary|Secret:0';
	const jwtOpts = {
		secret
	};
	fastify
		.register(fastifyJWT, jwtOpts)
		.register(fastifyAuth);

	next();
}

module.exports = fastifyPlugin(setup);
