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

	const collection = {
		find: jest.fn(() => {
			return {
				toArray: async () => sampleUsers
			};
		})
	};

	const utils = {
		unboxArray: jest.fn(() => sampleUsers)
	};

	const logger = {
		debug: jest.fn()
	};

	it('exported object should be a function', () => {
		expect(find).toEqual(expect.any(Function));
	});

	afterEach(() => {
		collection.find.mockClear();
	});

	it('should call collection.find function', async () => {
		await expect(find(utils, logger, {
			collection
		})).resolves.toEqual(sampleUsers);
		expect(collection.find).toHaveBeenCalledTimes(1);
		expect(collection.find).toHaveBeenCalledWith({}, {});
		expect(utils.unboxArray).toHaveBeenCalledWith(sampleUsers);
		expect(logger.debug).toHaveBeenCalled();
	});
});
