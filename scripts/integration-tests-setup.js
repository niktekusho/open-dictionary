const pullMongo = require('./pull-mongo');
const {start} = require('./setup-users-db-container');
const opts = require('./integration-tests-opts');

async function main() {
	try {
		await pullMongo();
		const container = await start();
		opts.container.id = container.id;
		console.log(container.id);
	} catch (error) {
		console.error(error);
	}
}

module.exports = main;
