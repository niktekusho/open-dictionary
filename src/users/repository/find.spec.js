const find = require('./find');

describe('User repository -> \'Find\' test suite', () => {
	const sampleUsers = [{
		username: 'veniam',
		email: 'Mx8E3H4TVr@rNaCqgnQxp.sz',
		passwordHash: 'amet cupidatat',
		roles: [
			'ADMIN',
			'ADMIN',
			'READER'
		]
	},
	{
		username: 'qui quis',
		email: 'fUwpRV@OXBlMuRHkVenLqQODZe.sw',
		passwordHash: 'pariatur',
		roles: [
			'ADMIN',
			'ADMIN'
		]
	}];

	function identity(obj) {
		return obj;
	}

	const findMock = jest.fn(() => {
		return {
			toArray: jest.fn(identity)
		};
	});

	const collection = {
		find: jest.fn(() => findMock(sampleUsers))
	};

	const utils = {
		unboxArray: jest.fn(identity)
	};

	const logger = {
		debug: jest.fn()
	};

	it('exported object should be a function', () => {
		expect(find).toEqual(expect.any(Function));
	});

	afterEach(() => {
		collection.find.mockReset();
	});

	it('\'find\' called without query object should return all users', async () => {
		await expect(find(utils, logger, {
			collection
		})).resolves.toEqual(sampleUsers);
		expect(find).toHaveBeenCalledTimes(1);
		expect(find).toHaveBeenCalledWith({}, {});
		expect(utils.unboxArray).toHaveBeenCalledWith(sampleUsers);
		expect(logger.debug).toHaveBeenCalled();
	});

	// it('\'find\' called with id should return undefined if user does not exist', async () => {
	// 	const fakeData = [];
	// 	findMock = findMock.mockImplementationOnce(() => {
	// 		return {
	// 			toArray: () => fakeData
	// 		};
	// 	});
	// 	const repository = await repositoryFactory(mongodb, connectionParams, logger);
	// 	const findQuery = {
	// 		username: 'someid'
	// 	};
	// 	await expect(repository.find(findQuery)).resolves.toBeUndefined();
	// 	expect(findMock).toHaveBeenCalledTimes(1);
	// 	expect(findMock).toHaveBeenCalledWith(findQuery);
	// });

	// it('\'find\' called without id should return undefined if no users exist', async () => {
	// 	const fakeData = [];
	// 	findMock = findMock.mockImplementationOnce(() => {
	// 		return {
	// 			toArray: () => fakeData
	// 		};
	// 	});
	// 	const repository = await repositoryFactory(mongodb, connectionParams, logger);
	// 	await expect(repository.find()).resolves.toBeUndefined();
	// 	expect(findMock).toHaveBeenCalledTimes(1);
	// 	expect(findMock).toHaveBeenCalledWith({});
	// });

	// it('\'find\' called with a query object should return users based on the query result', async () => {
	// 	const fakeData = [{}, {}];
	// 	findMock = findMock.mockImplementationOnce(() => {
	// 		return {
	// 			toArray: () => fakeData
	// 		};
	// 	});
	// 	const repository = await repositoryFactory(mongodb, connectionParams, logger);
	// 	const findQuery = {
	// 		email: 'dsa',
	// 		username: 'aaa'
	// 	};
	// 	await expect(repository.find(findQuery)).resolves.toBeDefined();
	// 	expect(findMock).toHaveBeenCalledTimes(1);
	// 	expect(findMock).toHaveBeenCalledWith(findQuery);
	// });
});
