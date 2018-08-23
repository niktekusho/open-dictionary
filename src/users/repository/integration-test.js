const Docker = require('dockerode');

const localDocker = new Docker();

describe('User Repository INTEGRATION TEST (requires Docker)', () => {
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

	let container;

	beforeAll(async () => {
		container = await setup('12345');
		await container.start();
	});

	it('Fake test', async () => {
		return new Promise(resolve => setTimeout(() => resolve(container), 10 * 1000));
	});

	afterAll(async () => {
		if (container) {
			await container.stop();
			await container.remove();
		}
	});
});
