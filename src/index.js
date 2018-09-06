const mongodb = require('mongodb');
const fastify = require('fastify');

const userRepositoryFactory = require('./users/repository');
const userServiceFactory = require('./users/user-service');
const userConfig = require('./config/user-config');
const utils = require('./utils');
const errorHandler = require('./error-handler');

const app = fastify({
	logger: true
});

async function main() {
	const mongoUrl = utils.buildMongoUrl(userConfig);
	try {
		const userRepository = await userRepositoryFactory(mongodb, mongoUrl, console, utils);
		const userService = await userServiceFactory({userRepository, errorHandler});
		app.get('/', async () => {
			try {
				return userService.getUsers();
			} catch (err) {
				app.log.error(err);
			}
		});
		const port = 3000;
		await app.listen(port);
	} catch (err) {
		app.log.error('Error booting server');
		app.log.error(err);
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
}

main().catch(err => {
	console.error(err);
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit(1);
});
