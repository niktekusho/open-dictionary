const repositoryFactory = require('./user.repository');

describe('User Repository test suite', () => {
	// Mongodb mocks
	let findMock = jest.fn();

	const createCollection = jest.fn(() => {
		return {
			createIndex: jest.fn(),
			find: findMock
		};
	});

	const collections = jest.fn(() => []);

	const db = jest.fn(() => {
		return {
			collections,
			createCollection
		};
	});

	const mongodb = {
		Logger: {
			setLevel: jest.fn(),
			filter: jest.fn()
		},
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
		debug: jest.fn(),
		error: jest.fn(),
		info: jest.fn()
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
		expect(createCollection).toHaveBeenCalledWith('users', expect.objectContaining({
			validator: {
				$jsonSchema: expect.anything()
			}
		}));
		expect(mongodb.MongoClient.connect).toBeCalledWith(url, opts);
	});
	it('User Repository has expected properties', async () => {
		const repository = await repositoryFactory(mongodb, connectionParams, logger);
		expect(repository).toHaveProperty('find');
		expect(repository).toHaveProperty('update');
		expect(repository).toHaveProperty('insert');
		expect(repository).toHaveProperty('delete');
	});

	it('log connection errors', async () => {
		const err = new Error('test');
		mongodb.MongoClient.connect.mockImplementationOnce(() => {
			throw err;
		});
		await expect(repositoryFactory(mongodb, connectionParams, logger)).resolves.toBeUndefined();
		expect(logger.error).toHaveBeenCalledTimes(1);
		expect(logger.error).toHaveBeenCalledWith(err);
	});

	describe('User repository \'find\' test suite', () => {
		afterEach(() => {
			findMock.mockReset();
		});

		it('\'find\' called without id should return all users', async () => {
			const fakeData = [{}, {}];
			findMock = findMock.mockImplementationOnce(() => {
				return {
					toArray: () => fakeData
				};
			});
			const repository = await repositoryFactory(mongodb, connectionParams, logger);
			await expect(repository.find()).resolves.toEqual(fakeData);
			expect(findMock).toHaveBeenCalledTimes(1);
			expect(findMock).toHaveBeenCalledWith({});
		});

		it('\'find\' called with id should return undefined if user does not exist', async () => {
			const fakeData = [];
			findMock = findMock.mockImplementationOnce(() => {
				return {
					toArray: () => fakeData
				};
			});
			const repository = await repositoryFactory(mongodb, connectionParams, logger);
			const findQuery = {
				username: 'someid'
			};
			await expect(repository.find(findQuery)).resolves.toBeUndefined();
			expect(findMock).toHaveBeenCalledTimes(1);
			expect(findMock).toHaveBeenCalledWith(findQuery);
		});

		it('\'find\' called without id should return undefined if no users exist', async () => {
			const fakeData = [];
			findMock = findMock.mockImplementationOnce(() => {
				return {
					toArray: () => fakeData
				};
			});
			const repository = await repositoryFactory(mongodb, connectionParams, logger);
			await expect(repository.find()).resolves.toBeUndefined();
			expect(findMock).toHaveBeenCalledTimes(1);
			expect(findMock).toHaveBeenCalledWith({});
		});

		it('\'find\' called with a query object should return users based on the query result', async () => {
			const fakeData = [{}, {}];
			findMock = findMock.mockImplementationOnce(() => {
				return {
					toArray: () => fakeData
				};
			});
			const repository = await repositoryFactory(mongodb, connectionParams, logger);
			const findQuery = {
				email: 'dsa',
				username: 'aaa'
			};
			await expect(repository.find(findQuery)).resolves.toBeDefined();
			expect(findMock).toHaveBeenCalledTimes(1);
			expect(findMock).toHaveBeenCalledWith(findQuery);
		});
	});
});
