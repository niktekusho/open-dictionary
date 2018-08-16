const deleteUser = require('./delete');

describe('User repository -> \'Delete\' test suite', () => {
	it('exported object should be a function', () => {
		expect(deleteUser).toEqual(expect.any(Function));
	});

	// TODO: current implementation is empty
	it('should call logger', async () => {
		const logger = {
			log: jest.fn()
		};
		const username = 'testUser';
		const collection = 'testCollection';
		await expect(deleteUser(username, logger, collection)).resolves;

		expect(logger.log).toHaveBeenCalled();
	});
});
