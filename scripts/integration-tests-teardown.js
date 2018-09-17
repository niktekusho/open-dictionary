const Docker = require('dockerode');
const {deleteContainer, stopContainer} = require('./teardown-users-db-container');
const opts = require('./integration-tests-opts');

// Check if the env var containing the id is set: if it is not just return
async function main() {
	if (opts.container.id) {
		const {id} = opts.container;
		const localDocker = new Docker();
		const container = localDocker.getContainer(id);
		if (container) {
			try {
				await stopContainer(container);
				await deleteContainer(container);
			} catch (error) {
				console.error(error);
			}
		} else {
			console.warn(`No container found with id: ${id}`);
		}
	} else {
		console.warn('TEMP_CONTAINER_ID env var not found.');
	}
}

module.exports = main;
