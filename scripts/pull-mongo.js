const Docker = require('dockerode');

// Wrap the callback with a Promise
async function main() {
	/* Docker pull required images before starting tests */
	return new Promise((resolve, reject) => {
		const localDocker = new Docker();
		localDocker.pull('mongo:4.0', (err, stream) => {
			if (err) {
				// Log the error and reject immediately
				console.error(err);
				reject(err);
			} else {
				stream.pipe(process.stdout);
				stream.once('end', resolve);
			}
		});
	});
}

module.exports = main;
