const repositoryFactory = require('./user.repository');

describe('User Repository test suite', () => {
	// Mongodb mocks
	const collection = jest.fn(() => {
		return {
			find: jest.fn()
		};
	});

	const db = jest.fn(() => {
		return {
			collection
		};
	});

	const mongodb = {
		MongoClient: {
			connect: jest.fn(() => {
				return {
					db
				};
			})
		}
	};

	// Logger mock
	const logger = {
		error: jest.fn(),
		info: jest.fn(),
		log: jest.fn()
	};

	const connectionParams = {
		host: 'host',
		port: '1234',
		database: 'db'
	};

	const url = (({host, port, database}) => `mongodb://${host}:${port}/${database}`)(connectionParams);
	const opts = {useNewUrlParser: true};

	it('User Repository can connect successfully', async () => {
		await repositoryFactory(mongodb, connectionParams, logger);
		expect(logger.info).toHaveBeenCalledWith(`Database at ${url} connected`);
		expect(logger.error).toHaveBeenCalledTimes(0);
		expect(logger.log).toHaveBeenCalledTimes(0);
		expect(collection).toHaveBeenCalledWith('users');
		expect(mongodb.MongoClient.connect).toBeCalledWith(url, opts);
	});
	it('User Repository has expected properties', async () => {
		const repository = await repositoryFactory(mongodb, connectionParams, logger);
		expect(repository).toHaveProperty('find');
		expect(repository).toHaveProperty('update');
		expect(repository).toHaveProperty('insert');
		expect(repository).toHaveProperty('delete');
	});
});
