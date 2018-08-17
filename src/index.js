const mongodb = require('mongodb');

const userRepositoryFactory = require('./users/repository');
const userServiceFactory = require('./users/user.service');

const userConfig = require('./config/user');

const fakeDataLoader = require('./fake.data.loader');

async function prepopulate(userRepository) {
	const fakeUsers = await fakeDataLoader('../generator/fake.users.json', {encoding: 'utf8'});
	const inserts = [];
	// FakeUsers.forEach(user => inserts.push(userService.createUser(user)));
	fakeUsers.forEach(user => inserts.push(userRepository.insert(user)));
	return Promise.all(inserts);
}

async function main() {
	const userRepository = await userRepositoryFactory(mongodb, userConfig, console);
	const errorHandler = (err, msg) => {
		console.error(err, msg);
		/* Throw err; */
	};
	const userService = await userServiceFactory({
		userRepository,
		errorHandler
	});
	console.log(userService);

	// Get all users
	const users = await userRepository.find();
	if (users === undefined) {
		// Populate with fake data if collection is empty
		await prepopulate(userRepository);
	}

	/*
		Const resp = await userService.createUser(validTestUser);
		console.log(resp);
	*/

	// return userService.getUsers();
	return userRepository.find({}, userRepository.projections.minimal);
}

main()
	.then(res => {
		console.log(res);
	})
	.then(() => {
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit();
	});
