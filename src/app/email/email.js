const fastifyPlugin = require('fastify-plugin');

const emailServiceFactory = require('../../email/email-service');

async function setup(fastify, opts, next) {
	const emailService = await emailServiceFactory(fastify.log);

	fastify.decorate('emailService', emailService);

	next();
}

module.exports = fastifyPlugin(setup);
