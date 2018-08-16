module.exports = {
	connect: async (mongodb, {
		host,
		port,
		database
	}, {buildMongoUrl}) => {
		const {
			MongoClient
		} = mongodb;
		const url = buildMongoUrl({host, port, database});

		const client = await MongoClient.connect(url, {
			useNewUrlParser: true
		});
		const db = await client.db();
		return db;
	}
};
