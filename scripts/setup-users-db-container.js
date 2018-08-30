const Docker = require('dockerode');

const localDocker = new Docker();
async function setup(hostPort, mongoImage) {
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

async function start() {
	const container = await setup('54321', 'mongo:4.0');
	try {
		await container.start();
		console.log('Container started');
		// Delay (default is 5 seconds)
		const delay = process.env.CONTAINER_DEFAULT_WAIT ? parseInt(process.env.CONTAINER_DEFAULT_WAIT, 10) : 5;
		// Resolve the promise after the set delay passing in the container just created and started
		return new Promise(resolve => setTimeout(resolve, delay * 1000, container));
	} catch (err) {
		// Log the error and fail the test
		console.error(err);
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(2);
	}
}

module.exports = {
	setup, start
};
