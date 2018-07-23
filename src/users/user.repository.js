async function repository(mongodb, {host, port, database}, logger) {
	const {MongoClient} = mongodb;
	const url = `mongodb://${host}:${port}/${database}`;

	let client;
	try {
		client = await MongoClient.connect(url, {useNewUrlParser: true});
	} catch (err) {
		// TODO retryConnection()
		logger.error(err);
	}

	logger.info(`Database at ${url} connected`);

	const {db} = client;
	return {
		db
	};
}

module.exports = repository;
