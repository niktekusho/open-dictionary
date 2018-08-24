const {
	fakeUsers: sampleUsers
} = require('../test-utils');

const find = require('./find');

describe('User repository -> \'Find\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(find).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
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

		afterEach(() => {
			collection
				.find
				.mockClear();
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

		describe('when the result is empty', () => {
			it('should resolve with undefined', async () => {
				utils.unboxArray.mockImplementationOnce(() => undefined);
				await expect(find(utils, logger, {
					collection
				})).resolves.toBeUndefined();
			});
		});
	});
});
