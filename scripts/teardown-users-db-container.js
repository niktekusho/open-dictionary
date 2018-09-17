
async function stopContainer(container) {
	if (container === undefined || container === null) {
		console.warn('Container was undefined. Exiting...');
		return;
	}
	try {
		await container.stop();
		console.log('Container stopped');
	} catch (error) {
		console.error('Could not stop container', error);
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
	} catch (error) {
		console.error('Could not delete container', error);
	}
}

module.exports = {
	stopContainer, deleteContainer
};
