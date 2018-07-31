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

	const collection = await db.createCollection('users', {
		validator: {
			$jsonSchema: {
				bsonType: 'object',
				required: ['name', 'email', 'roles'],
				properties: {
					name: {
						bsonType: 'string'
					},
					email: {
						bsonType: 'string'
					},
					nativeLanguage: {
						bsonType: 'string'
					},
					languages: {
						bsonType: ['string']
					},
					roles: {
						bsonType: 'array',
						items: {
							bsonType: 'string',
							enum: ['ADMIN', 'WRITER', 'REVIEWER', 'READER']
						}
					},
					metadata: {
						bsonType: 'object',
						properties: {
							creationDate: {
								bsonType: 'date'
							},
							lastAccess: {
								bsonType: 'date'
							}
						}
					}
				}
			}
		}
	});

	try {
		await collection.createIndex({email: 1}, {unique: true});
	} catch (err) {
		logger.error(err);
	}

	// Internal function for "unboxing" arrays: if the array is empty, this function returns undefined
	function unboxArray(array) {
		// Basic check
		if (Array.isArray(array)) {
			// If the array is empty return undefined
			switch (array.length) {
				case 0: return undefined;
				case 1: return array[0];
				default: return array;
			}
		}
		return array;
	}

	return {
		find: async (query = {}) => {
			logger.debug(query);
			const dbResponse = await collection.find(query).toArray();
			logger.debug(dbResponse);
			return unboxArray(dbResponse);
		},
		insert: async ({
			name,
			email,
			passwordHash,
			nativeLanguage,
			roles
		}) => {
			// Usare insertOne
			logger.log('TODO', {name,
				email,
				passwordHash,
				nativeLanguage,
				roles});
			return collection.insertOne({
				name,
				email,
				passwordHash,
				nativeLanguage,
				roles,
				metadata: {
					creationDate: new Date()
				}
			});
		},
		update: async (id, {
			email, name, passwordHash, nativeLanguage, role
		}) => {
			logger.log('TODO', {id, email, name, passwordHash, nativeLanguage, role});
		},
		delete: async ({id}) => {
			logger.log('TODO', id);
		}
	};
}

module.exports = repository;
