module.exports = {
	connect: async (mongodb, mongoUrl) => {
		const {
			MongoClient
		} = mongodb;
		const client = await MongoClient.connect(mongoUrl, {
			useNewUrlParser: true
		});
		const db = await client.db();
		return db;
	}
};
