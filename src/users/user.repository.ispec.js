const mongodb = require('mongodb');
const utils = require('../utils');
const userRepositoryFactory = require('./repository');
const {fakeUsers, validFakeUsers} = require('./test-utils');

describe('User Repository INTEGRATION TEST', () => {
	const mongoHost = process.env.MONGO_HOST ? process.env.MONGO_HOST : 'localhost';
	const mongoPort = process.env.MONGO_PORT ? process.env.MONGO_PORT : '54321';
	const url = `mongodb://${mongoHost}:${mongoPort}/users`;

	const logger = {
		debug: jest.fn(),
		error: jest.fn(),
		info: jest.fn()
	};

	afterEach(async () => {
		// Drop the collection after each test
		const client = await mongodb.MongoClient.connect(url, {useNewUrlParser: true});
		const db = await client.db();
		const collection = await db.collection('users');
		await collection.drop();
	});

	it('should connect successfully', async () => {
		const userRepository = await userRepositoryFactory(mongodb, url, logger, utils);
		expect(userRepository).toBeDefined();
	});

	it('initially should find 0 users', async () => {
		const userRepository = await userRepositoryFactory(mongodb, url, logger, utils);
		await expect(userRepository.find()).resolves.toBeUndefined();
	});

	it('inserting an invalid user should fail', async () => {
		const userRepository = await userRepositoryFactory(mongodb, url, logger, utils);
		const invalidUser = Object.assign({}, fakeUsers[0]);
		// Email is a required property: removing that key should make the insertion fail
		delete invalidUser.email;
		await expect(userRepository.insert(invalidUser)).rejects.toThrow(expect.any(Error));
	});

	it('inserting a valid user should succeed', async () => {
		const userRepository = await userRepositoryFactory(mongodb, url, logger, utils);
		await expect(userRepository.insert(validFakeUsers[0])).resolves.toBeDefined();
	});

	it('inserting a duplicate user should fail', async () => {
		const userRepository = await userRepositoryFactory(mongodb, url, logger, utils);
		await expect(userRepository.insert(validFakeUsers[0])).resolves.toBeDefined();
	});

	it('updating user should succeed', async () => {
		const userRepository = await userRepositoryFactory(mongodb, url, logger, utils);
		const user = validFakeUsers[0];
		// First insert
		await userRepository.insert(user);
		// Make some change in the user
		user.roles = ['READER'];
		// Try to update the user
		await expect(userRepository.update(user.username, user)).resolves.toBeDefined();
	});
});
