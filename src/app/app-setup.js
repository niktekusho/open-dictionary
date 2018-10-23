const fastifyPlugin = require('fastify-plugin');
const mongodb = require('mongodb');
const httpErrors = require('http-errors');
const fastifyJWT = require('fastify-jwt');
const fastifyAuth = require('fastify-auth');

const errors = require('../errors');

const userRepositoryFactory = require('../users/repository');
const userServiceFactory = require('../users/service/user-service');
const userConfig = require('../config/user-config');
const utils = require('../utils');

const emailService = require('./email/email');

// "Sane" JWT Secret
const defaultSecret = 'open_Dictionary|Secret:0';

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

	// Add the common errors factory functions
	fastify.decorate('errors', errors);

	// Use a sane JWT secret... even though it SHOULD USE the env var!
	const secret = process.env.OD_SECRET || defaultSecret;
	const jwtOpts = {
		secret
	};
	fastify
		.register(fastifyJWT, jwtOpts)
		.register(fastifyAuth)
		.register(emailService);

	// Create an 'authenticate' method to secure specific routes using each route's 'beforeHandler' function
	fastify.decorate('authenticate', async (request, reply) => {
		try {
			await request.jwtVerify();
		} catch (error) {
			return reply.code(401).send(error);
		}
	});

	next();
}

module.exports = fastifyPlugin(setup);
