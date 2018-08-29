const mongodb = require('mongodb');
const utils = require('../utils');
const userRepositoryFactory = require('./repository');
const {fakeUsers, validFakeUsers} = require('./test-utils');

describe('User Repository INTEGRATION TEST (requires Docker)', () => {
	const localDocker = new Docker();
	async function setup(hostPort, mongoImage) {
		localDocker.pull(mongoImage, (err, stream) => {
			if (err) {
				// Log the error and fail the test
				console.error(err);
				// eslint-disable-next-line unicorn/no-process-exit
				process.exit(2);
			}
			stream.pipe(process.stdout);
		});
		const mongoContainer = await localDocker.createContainer({
			Image: mongoImage,
			Hostconfig: {
				PortBindings: {
					'27017/tcp': [{
						HostPort: hostPort
					}]
				}
			},
			AttachStdin: false,
			AttachStdout: true,
			AttachStderr: true,
			Tty: true,
			OpenStdin: false,
			StdinOnce: false
		});
		return mongoContainer;
	}

	const url = 'mongodb://localhost:54321/users';

	let container;

	const logger = {
		debug: jest.fn(),
		error: jest.fn(),
		info: jest.fn()
	};

	beforeAll(async () => {
		container = await setup('54321', 'mongo:4.0');
		try {
			await container.start();
			console.log('Container started');
			// Delay (default is 2 seconds)
			const delay = process.env.CONTAINER_DEFAULT_WAIT ? parseInt(process.env.CONTAINER_DEFAULT_WAIT, 10) : 2;
			return new Promise(resolve => setTimeout(resolve, delay * 1000));
		} catch (err) {
			// Log the error and fail the test
			console.error(err);
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(2);
		}
	});

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
