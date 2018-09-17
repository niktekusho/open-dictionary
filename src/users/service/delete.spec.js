const {fakeUsers} = require('../test-utils');

const deleteUser = require('./delete');

describe('User service -> \'Delete\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(deleteUser).toEqual(expect.any(Function));
		});
	});

	// ### MOCKS User repository mock
	const userRepository = {
		delete: jest.fn(async () => true)
	};

	// Logger mock
	const logger = {
		debug: jest.fn(),
		error: jest.fn()
	};

	afterEach(() => {
		userRepository
			.delete
			.mockClear();
	});

	// ### END MOCKS

	describe('when the current user is an Admin', () => {
		it('should call userRepository error function with the username parameter', async () => {
			const username = 'test';
			const currentUser = fakeUsers[0];
			await expect(deleteUser(currentUser, username, userRepository, logger))
				.resolves
				.toEqual(true);
			expect(userRepository.delete).toHaveBeenCalledTimes(1);
			expect(userRepository.delete).toHaveBeenCalledWith(username);
		});
	});

	describe('when the current user is not an Admin', () => {
		describe('and it tries to delete a user which is not itself', () => {
			it('should reject with an error sayng that the user does not have the appropriate pe' +
                    'rmissions',
			async () => {
				const username = 'test';
				const currentUser = {
					username: 'ok',
					roles: ['REVIEWER']
				};
				try {
					await deleteUser(currentUser, username, userRepository, logger);
				} catch (error) {
					expect(error).toMatchObject(expect.any(Error));
				}
				expect(userRepository.delete).toHaveBeenCalledTimes(0);
			});
		});
		describe('and it tries to delete itself', () => {
			it('should resolve correctly', async () => {
				const username = 'ok';
				const currentUser = {
					username: 'ok',
					roles: ['REVIEWER']
				};
				await expect(deleteUser(currentUser, username, userRepository, logger))
					.resolves
					.toEqual(true);
				expect(userRepository.delete).toHaveBeenCalledTimes(1);
				expect(userRepository.delete).toHaveBeenCalledWith(username);
			});
		});
	});
});
