async function repository(mongodb, {host, port, database}, logger) {
	const {MongoClient} = mongodb;
	const url = `mongodb://${host}:${port}/${database}`;

	let client;
	let db;
	try {
		client = await MongoClient.connect(url, {useNewUrlParser: true});
		db = await client.db();
	} catch (err) {
		// TODO retryConnection()
		logger.error(err);
	}

	logger.info(`Database at ${url} connected`);

	const collection = await db.collection('users');

	return {
		find: ({id} = {}) => {
			// Check for defined: if it is I am looking for a specific user
			if (id) {
				return collection.find({id}).toArray();
			}
			// If id not defined, return all users (TODO might need to remove a LOT of info when returning this)
			return collection.find({}).toArray();
		},
		insert: ({
			name,
			email,
			passwordHash,
			nativeLanguage,
			role
		}) => {
			logger.log('TODO', {name,
				email,
				passwordHash,
				nativeLanguage,
				role});
		},
		update: (id, {
			email, name, passwordHash, nativeLanguage, role
		}) => {
			logger.log('TODO', {id, email, name, passwordHash, nativeLanguage, role});
		},
		delete: ({id}) => {
			logger.log('TODO', id);
		}
	};
}

module.exports = repository;
