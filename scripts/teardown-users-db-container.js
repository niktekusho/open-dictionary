
async function stopContainer(container) {
	if (container === undefined || container === null) {
		console.warn('Container was undefined. Exiting...');
		return;
	}
	try {
		await container.stop();
		console.log('Container stopped');
	} catch (err) {
		console.error('Could not stop container', err);
	}
}

async function deleteContainer(container) {
	if (container === undefined || container === null) {
		console.warn('Container was undefined. Exiting...');
		return;
	}
	try {
		await container.remove();
		console.log('Container deleted');
	} catch (err) {
		console.error('Could not delete container', err);
	}
}

module.exports = {
	stopContainer, deleteContainer
};
