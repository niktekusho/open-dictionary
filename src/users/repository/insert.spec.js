const {
	fakeUsers: sampleUsers
} = require('../test.utils');

const insert = require('./insert');

describe('User repository -> \'Insert\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(insert).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
		it('should resolve without errors even when the user arg is null or undefined', async () => {
			await expect(insert(null, console, {})).resolves.toBeNull();
			await expect(insert(undefined, console, {})).resolves.toBeNull();
		});

		const logger = {
			debug: jest.fn()
		};

		it('should call collection.insertOne if the user arg is an object', async () => {
			const collection = {
				insertOne: jest.fn(async i => i)
			};

			const fakeUser = sampleUsers[0];
			await expect(insert(fakeUser, logger, {
				collection
			})).resolves.toEqual(fakeUser);
			expect(logger.debug).toHaveBeenCalled();
			expect(collection.insertOne).toHaveBeenCalledTimes(1);
			expect(collection.insertOne).toHaveBeenCalledWith(fakeUser, {});
		});

		it('should call collection.insertMany if the user arg is an object', async () => {
			const collection = {
				insertMany: jest.fn(async i => i)
			};

			await expect(insert(sampleUsers, logger, {
				collection
			})).resolves.toEqual(sampleUsers);
			expect(logger.debug).toHaveBeenCalled();
			expect(collection.insertMany).toHaveBeenCalledTimes(1);
			expect(collection.insertMany).toHaveBeenCalledWith(sampleUsers, {});
		});

		it('should call the appropriate insert function using the specified insert options', async () => {
			const collection = {
				insertOne: jest.fn(async i => i)
			};

			// sample of real options
			const insertOpts = {
				w: 'majority',
				wtimeout: 10000,
				serializeFunctions: true,
				forceServerObjectId: true
			}

			const fakeUser = sampleUsers[0];
			await expect(insert(fakeUser, logger, {
				collection, insertOpts
			})).resolves.toBeDefined();
			expect(collection.insertOne).toHaveBeenCalledTimes(1);
			expect(collection.insertOne).toHaveBeenCalledWith(fakeUser, insertOpts);
		});
	});
});
