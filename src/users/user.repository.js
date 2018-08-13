async function repository(mongodb, {host, port, database}, logger) {
	const {MongoClient, Logger} = mongodb;
	const url = `mongodb://${host}:${port}/${database}`;

	let client;
	let db;
	try {
		client = await MongoClient.connect(url, {useNewUrlParser: true});
		Logger.setLevel('debug');
		Logger.filter('class', ['Db']);
		db = await client.db();
	} catch (err) {
		// TODO retryConnection()
		logger.error(err);
	}

	async function createIndexes(userCollection) {
		await userCollection.createIndex({email: 1}, {unique: true});
		await userCollection.createIndex({username: 1}, {unique: true});
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

	if (db !== undefined && db !== null) {
		logger.info(`Database at ${url} connected`);

		const collection = await db.createCollection('users', {
			validator: {
				$jsonSchema: {
					bsonType: 'object',
					required: ['username', 'email', 'passwordHash', 'roles'],
					properties: {
						username: {
							bsonType: 'string'
						},
						fullname: {
							bsonType: ['string', 'null']
						},
						email: {
							bsonType: 'string'
						},
						nativeLanguage: {
							bsonType: ['string', 'null']
						},
						languages: {
							bsonType: ['array', 'null'],
							items: {
								bsonType: 'string'
							}
						},
						passwordHash: {
							bsonType: 'string'
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
			await createIndexes(collection);
		} catch (err) {
			logger.error(err);
		}

		return {
			find: async (query = {}) => {
				logger.debug(query);
				const dbResponse = await collection.find(query).toArray();
				logger.debug(dbResponse);
				return unboxArray(dbResponse);
			},
			insert: async ({
				username,
				fullname,
				email,
				passwordHash,
				nativeLanguage,
				roles
			}) => {
				const obj = {
					fullname,
					username,
					email,
					passwordHash,
					nativeLanguage,
					roles,
					metadata: {
						creationDate: new Date()
					}
				};
				logger.debug(JSON.stringify(obj));
				return collection.insertOne(obj);
			},
			update: async (usernameToUpdate, {
				email, fullname, username, passwordHash, nativeLanguage, role
			}) => {
				logger.log('TODO', {username, email, fullname, passwordHash, nativeLanguage, role});
			},
			delete: async ({username}) => {
				logger.log('TODO', username);
			}
		};
	}
}

module.exports = repository;
