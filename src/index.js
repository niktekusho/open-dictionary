const mongodb = require('mongodb');

const userRepositoryFactory = require('./users/user.repository');
const userServiceFactory = require('./users/user.service');

const userConfig = require('./config/user');

async function main() {
	const userRepository = await userRepositoryFactory(mongodb, userConfig, console);
	const errorHandler = (err, msg) => {
		console.error(msg);
		throw err;
	};
	const userService = await userServiceFactory({userRepository, errorHandler});
	return userService.getUsers();
}

main()
	.then(res => {
		console.log(res);
	})
	.then(() => {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit();
	});
