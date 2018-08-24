const Docker = require('dockerode');
const mongodb = require('mongodb');
const utils = require('../utils');
const userRepositoryFactory = require('./repository');

describe('User Repository INTEGRATION TEST (requires Docker)', () => {
	const localDocker = new Docker();
	async function setup(hostPort) {
		const mongoContainer = await localDocker.createContainer({
			Image: 'mongo:4.0.0',
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

	beforeAll(async () => {
		container = await setup('54321');
		try {
			await container.start();
			console.log('Container started');
			// Delay
			return new Promise(resolve => setTimeout(resolve, 1 * 1000));
		} catch (err) {
			// Log the error and fail the test
			console.error(err);
			// eslint-disable-next-line unicorn/no-process-exit
			process.exit(2);
		}
	});

	it('should connect successfully', async () => {
		const userRepository = await userRepositoryFactory(mongodb, url, console, utils);
		expect(userRepository).toBeDefined();
	});

	it('initially should find 0 users', async () => {
		const userRepository = await userRepositoryFactory(mongodb, url, console, utils);
		await expect(userRepository.find()).toBeUndefined();
	});

	afterAll(async () => {
		if (container) {
			await container.stop();
			await container.remove();
		}
	});
});
