const fastifyPlugin = require('fastify-plugin');
const mongodb = require('mongodb');
const httpErrors = require('http-errors');

const userRepositoryFactory = require('../users/repository');
const userServiceFactory = require('../users/service/user-service');
const userConfig = require('../config/user-config');
const utils = require('../utils');

async function setup(fastify, opts, next) {
	const mongoUrl = utils.buildMongoUrl(userConfig);
	const userRepository = await userRepositoryFactory(mongodb, mongoUrl, console, utils);
	fastify.decorate('userRepository', userRepository);
	const userService = await userServiceFactory(userRepository, console);
	fastify.decorate('userService', userService);
	fastify.decorate('httpErrors', httpErrors);
	next();
}

module.exports = fastifyPlugin(setup);
