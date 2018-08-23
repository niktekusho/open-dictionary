const mongodb = require('mongodb');

const userRepositoryFactory = require('./users/repository');
// Const userServiceFactory = require('./users/user.service');

const userConfig = require('./config/user-config');

const fakeDataLoader = require('./fake.data.loader');

const utils = require('./utils');

async function prepopulate(userRepository) {
	const fakeUsers = await fakeDataLoader('../generator/quick.fake.users.json', {encoding: 'utf8'});
	const inserts = [];
	// FakeUsers.forEach(user => inserts.push(userService.createUser(user)));
	fakeUsers.forEach(user => inserts.push(userRepository.insert(user)));
	return Promise.all(inserts);
}

async function main() {
	const mongoUrl = utils.buildMongoUrl(userConfig);
	const userRepository = await userRepositoryFactory(mongodb, mongoUrl, console, utils);
	// Const errorHandler = (err, msg) => { 	console.error(err, msg); 	/* Throw err;
	// */ }; const userService = await userServiceFactory({ 	userRepository,
	// 	errorHandler }); console.log(userService); Get all users
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
	const nonUser = await userRepository.find(userRepository.queries.equalsUsername('non'), userRepository.projections.minimal);
	console.log(nonUser);
	const guazUser = await userRepository.find(userRepository.queries.equalsEmail('OHAX5RrdDmaa42@anDShiPY.guaz'), userRepository.projections.minimal);
	console.log(guazUser);
	return userRepository.find(userRepository.queries.createdToday());
}

main().then(res => {
	console.log(res);
}).then(() => {
	// eslint-disable-next-line unicorn/no-process-exit
	process.exit();
});
