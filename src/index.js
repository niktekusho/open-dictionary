const mongodb = require('mongodb');
const fastify = require('fastify');

const userRepositoryFactory = require('./users/repository');
const userServiceFactory = require('./users/service/user-service');
const userAPI = require('./users/user-api');
const userConfig = require('./config/user-config');
const utils = require('./utils');

const app = fastify({
	logger: true
});

async function main() {
	const mongoUrl = utils.buildMongoUrl(userConfig);
	try {
		const userRepository = await userRepositoryFactory(mongodb, mongoUrl, console, utils);
		const userService = await userServiceFactory(userRepository, console);
		const usersRoutes = userAPI(userService);
		app.register(usersRoutes, {prefix: '/users'});
		const port = 3000;
		await app.listen(port);
		app.ready(() => {
			console.log(app.printRoutes());
		});
	} catch (error) {
		app.log.error('Error booting server');
		app.log.error(error);
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
}

main().catch(error => {
	console.error(error);
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(1);
});
