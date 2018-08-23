const init = require('./init');
const userSchema = require('./validation-schema');
const setupIndexes = require('./setup-indexes');
const find = require('./find');
const insert = require('./insert');
const update = require('./update');
const deleteUser = require('./delete');
const projections = require('./projections');
const queries = require('./queries');

module.exports = async function (mongodb, mongoUrl, logger, utils) {
	let db;
	try {
		db = await init.connect(mongodb, mongoUrl);
	} catch (error) {
		// TODO handle reconnection
		logger.error('Trouble connecting to mongo', error);
	}

	if (db !== undefined && db !== null) {
		logger.info(`Database at ${mongoUrl} connected`);

		const collection = await db.createCollection('users', {
			validator: userSchema
		});

		await setupIndexes(collection);

		return {
			queries: queries(mongodb),
			projections: projections(utils),
			find: async (query = {}, projection = {}) => find(utils, logger, {collection, query, projection}),
			insert: async user => insert(user, logger, {collection}),
			update: async (username, newUser) => update({username, newUser}, logger, collection),
			delete: async ({username}) => deleteUser(username, logger, collection)
		};
	}
};
