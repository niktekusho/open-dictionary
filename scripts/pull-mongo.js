const Docker = require('dockerode');

function main() {
	/* Docker pull required images before starting tests */
	const localDocker = new Docker();
	localDocker.pull('mongo:4.0', (err, stream) => {
		if (err) {
			// Log the error
			console.error(err);
		}
		stream.pipe(process.stdout);
	});
}

module.exports = main();
