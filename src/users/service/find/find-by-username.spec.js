const {fakeUsers} = require('../../test.utils');

const findByUsername = require('./find-by-username');

describe('User service -> \'Find By Username\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(findByUsername).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
		// ### MOCKS User repository mock
		const userRepository = {
			find: jest.fn(async () => fakeUsers[0]),
			queries: {
				equalsUsername: jest.fn(username => username)
			}
		};

		// Logger mock
		const logger = {
			debug: jest.fn()
		};

		// ### END MOCKS

		it('should call userRepository find function with the username parameter', async () => {
			const username = 'test';
			const projection = {};
			await expect(findByUsername(userRepository, username, projection, logger))
				.resolves
				.toEqual(fakeUsers[0]);
			expect(userRepository.find).toHaveBeenCalledTimes(1);
			expect(userRepository.find).toHaveBeenCalledWith(username, projection);
		});
	});
});
