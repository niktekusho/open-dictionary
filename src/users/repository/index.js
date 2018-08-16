const init = require('./init');
const userSchema = require('./validation.schema');
const setupIndexes = require('./setup.indexes');
const find = require('./find');
const insert = require('./insert');
const update = require('./update');
const deleteUser = require('./delete');
const projections = require('./projections');
const queries = require('./queries');

module.exports = async function (mongodb, {
	host,
	port,
	database
}, logger, utils) {
	let db;
	try {
		db = await init(mongodb, {
			host,
			port,
			database
		}, logger);
	} catch (error) {
		// TODO handle reconnection
		logger.error('Trouble connecting to mongo', error);
	}

	if (db !== undefined && db !== null) {
		logger.info(`Database at ${utils.buildMongoUrl({host, port, database})} connected`);

		const collection = await db.createCollection('users', {
			validator: userSchema
		});

		await setupIndexes(collection);

		return {
			queries,
			projections: projections(utils),
			find: async (query = {}, projection = {}) => find(utils, logger, collection, query, projection),
			insert: async user => insert(user, logger, collection),
			update: async (usernameToUpdate, updatedUser) => update(usernameToUpdate, updatedUser, logger, collection),
			delete: async ({username}) => deleteUser(username, logger, collection)
		};
	}
};