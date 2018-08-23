const setupIndexes = require('./setup-indexes');

describe('User repository -> \'Setup Indexes\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(setupIndexes).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
		it('should create indexes on the specified collection', async () => {
			const collection = {
				createIndex: jest.fn(async () => true)
			};
			await expect(setupIndexes(collection))
				.resolves
				.toBeUndefined();
			// Twice: usernames and emails
			expect(collection.createIndex).toHaveBeenCalledTimes(2);
			// Check for emails
			expect(collection.createIndex).toHaveBeenNthCalledWith(1, {
				email: 1
			}, {unique: true});
			// Check for usernames
			expect(collection.createIndex).toHaveBeenNthCalledWith(2, {
				username: 1
			}, {unique: true});
		});
	});
});
