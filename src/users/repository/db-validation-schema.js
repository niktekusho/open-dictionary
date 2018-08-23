module.exports = {
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
};
