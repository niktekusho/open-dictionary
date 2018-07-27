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
				required: ['id', 'name', 'email', 'roles'],
				properties: {
					id: {
						bsonType: 'string',
						description: 'Required ID used for API query. Must be unique and required.'
					},
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
							enum: ['ADMIN', 'WRITER', 'REVIEWER', 'READONLY']
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

	// Internal function for "unboxing" arrays: if the array is empty, this function returns undefined
	function unboxArray(array) {
		// Basic check
		if (Array.isArray(array)) {
			// If the array is empty return undefined
			return array.length === 0 ? undefined : array;
		}
		return array;
	}

	return {
		find: async ({id} = {}) => {
			logger.debug(id);
			// Check for defined: if it is I am looking for a specific user
			if (id) {
				return unboxArray(collection.findOne({id}).toArray());
			}
			// If id not defined, return all users (TODO might need to remove a LOT of info when returning this)
			return collection.find({}).toArray();
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
