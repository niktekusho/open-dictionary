const deleteUser = require('./delete');

describe('User repository -> \'Delete\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(deleteUser).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
		it('when username is undefined it should resolve with null', async () => {
			await expect(deleteUser(undefined, null, null)).resolves.toBeNull();
		});

		it('when username is null it should resolve with null', async () => {
			await expect(deleteUser(null, null, null)).resolves.toBeNull();
		});

		it('should call findOneAndDelete', async () => {
			const expectedResponse = {};

			const collection = {
				findOneAndDelete: jest.fn(async () => expectedResponse)
			};

			const logger = {
				debug: jest.fn()
			};

			await expect(deleteUser('test', logger, collection)).resolves.toEqual(expectedResponse);
			expect(collection.findOneAndDelete).toHaveBeenCalledTimes(1);
			expect(collection.findOneAndDelete).toHaveBeenCalledWith({username: 'test'});
		});
	});
});
