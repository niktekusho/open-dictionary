const repositoryFactory = require('./user.repository');

describe('User Repository test suite', () => {
	// Mongodb mocks
	let findMock = jest.fn();
	let findOneMock = jest.fn();

	const createCollection = jest.fn(() => {
		return {
			find: findMock,
			findOne: findOneMock
		};
	});

	const db = jest.fn(() => {
		return {
			createCollection
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
		expect(createCollection).toHaveBeenCalledWith('users', expect.anything());
		expect(mongodb.MongoClient.connect).toBeCalledWith(url, opts);
	});
	it('User Repository has expected properties', async () => {
		const repository = await repositoryFactory(mongodb, connectionParams, logger);
		expect(repository).toHaveProperty('find');
		expect(repository).toHaveProperty('update');
		expect(repository).toHaveProperty('insert');
		expect(repository).toHaveProperty('delete');
	});

	describe('User repository \'find\' test suite', () => {
		afterEach(() => {
			findOneMock.mockReset();
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
			expect(findOneMock).toHaveBeenCalledTimes(0);
		});

		it('\'find\' called with id should return specific user (assuming that the user exists)', async () => {
			const fakeData = {};
			findOneMock = findOneMock.mockImplementationOnce(() => {
				return {
					toArray: () => fakeData
				};
			});
			const repository = await repositoryFactory(mongodb, connectionParams, logger);
			const findQuery = {
				id: 'someid'
			};
			await expect(repository.find(findQuery)).resolves.toEqual(fakeData);
			expect(findOneMock).toHaveBeenCalledTimes(1);
			expect(findOneMock).toHaveBeenCalledWith(findQuery);
			expect(findMock).toHaveBeenCalledTimes(0);
		});

		it('\'find\' called with id should return undefined if user does not exists', async () => {
			const fakeData = [];
			findOneMock = findOneMock.mockImplementationOnce(() => {
				return {
					toArray: () => fakeData
				};
			});
			const repository = await repositoryFactory(mongodb, connectionParams, logger);
			const findQuery = {
				id: 'someid'
			};
			await expect(repository.find(findQuery)).resolves.toBeUndefined();
			expect(findOneMock).toHaveBeenCalledTimes(1);
			expect(findOneMock).toHaveBeenCalledWith(findQuery);
			expect(findMock).toHaveBeenCalledTimes(0);
		});
	});
});
