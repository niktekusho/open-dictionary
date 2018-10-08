const {fakeUsers} = require('../../users-test-utils');

const findByEmail = require('./find-by-email');

describe('User service -> \'Find By Email\' test suite', () => {
	describe('Evaluating module functionality', () => {
		// ### MOCKS User repository mock
		const userRepository = {
			find: jest.fn(async () => fakeUsers[0]),
			queries: {
				equalsEmail: jest.fn(email => email)
			}
		};

		// Logger mock
		const logger = {
			debug: jest.fn()
		};

		// ### END MOCKS

		it('should call userRepository find function with the email parameter', async () => {
			const email = 'test@t.t';
			await expect(findByEmail(userRepository, email, {}, logger))
				.resolves
				.toEqual(fakeUsers[0]);
			expect(userRepository.find).toHaveBeenCalledTimes(1);
			expect(userRepository.find).toHaveBeenCalledWith(email, {});
		});
	});
});
