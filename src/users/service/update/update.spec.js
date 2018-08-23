const {fakeUsers} = require('../../test-utils');
const updateUser = require('./update');

describe('User service -> \'Update\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(updateUser).toEqual(expect.any(Function));
		});
	});

	// ### MOCKS User repository mock
	const userRepository = {
		update: jest.fn(async () => true)
	};

	// Logger mock
	const logger = {
		debug: jest.fn(),
		error: jest.fn()
	};

	afterEach(() => {
		logger
			.error
			.mockClear();
		userRepository
			.update
			.mockClear();
	});

	// ### END MOCKS

	describe('when there is any error concerning the storage', () => {
		const currentUser = fakeUsers[0];
		const userToUpdate = fakeUsers[1];
		it('should reject with a generic error', async () => {
			userRepository
				.update
				.mockImplementationOnce(() => Promise.reject(new Error()));
			try {
				await updateUser(currentUser, userToUpdate, userRepository, logger);
			} catch (err) {
				expect(err).toMatchObject(expect.any(Error));
				expect(err.message).toMatch(/(.*)failed(.*)/i);
			}
			expect(userRepository.update).toHaveBeenCalledTimes(1);
		});
		it('should log the raised error', async () => {
			userRepository
				.update
				.mockImplementationOnce(() => Promise.reject(new Error()));
			try {
				await updateUser(currentUser, userToUpdate, userRepository, logger);
			} catch (err) {
				expect(logger.error).toHaveBeenCalledTimes(1);
			}
		});
	});

	describe('when the current user is null or undefined', () => {
		it('should reject to update no-matter-what', async () => {
			try {
				await expect(updateUser(null, {}, userRepository, logger));
			} catch (err) {
				expect(err).toMatchObject(expect.any(Error));
			}
			try {
				await expect(updateUser(undefined, {}, userRepository, logger));
			} catch (err) {
				expect(err).toMatchObject(expect.any(Error));
			}
			expect(userRepository.update).toHaveBeenCalledTimes(0);
		});
	});

	describe('when the user update object is null or undefined', () => {
		it('should resolve but do nothing else', async () => {
			await expect(updateUser({}, null, userRepository, logger))
				.resolves
				.toBeUndefined();
			await expect(updateUser({}, undefined, userRepository, logger))
				.resolves
				.toBeUndefined();
			expect(userRepository.update).toHaveBeenCalledTimes(0);
		});
	});

	describe('when the current user is an Admin', () => {
		it('should be able to update no-matter-what an other user', async () => {
			const currentUser = fakeUsers[0];
			const userToUpdate = fakeUsers[1];
			await expect(updateUser(currentUser, userToUpdate, userRepository, logger))
				.resolves
				.toBeDefined();
			expect(userRepository.update).toHaveBeenCalledTimes(1);
			expect(userRepository.update).toHaveBeenCalledWith(userToUpdate.username, userToUpdate);
		});
	});

	describe('when the current user is not an Admin', () => {
		describe('and it tries to update a user which is not itself', () => {
			it('should reject with an error saying that the user does not have the appropriate p' +
                    'ermissions',
			async () => {
				const currentUser = {
					username: 'ok',
					roles: ['REVIEWER']
				};
				try {
					await updateUser(currentUser, fakeUsers[0], userRepository, logger);
				} catch (err) {
					expect(err).toMatchObject(expect.any(Error));
				}
				expect(userRepository.update).toHaveBeenCalledTimes(0);
			});
		});
		describe('and it tries to update itself', () => {
			it('should resolve correctly', async () => {
				const username = 'ok';
				const currentUser = {
					username: 'ok',
					roles: ['REVIEWER']
				};
				await expect(updateUser(currentUser, currentUser, userRepository, logger))
					.resolves
					.toBeDefined();
				expect(userRepository.update).toHaveBeenCalledTimes(1);
				expect(userRepository.update).toHaveBeenCalledWith(username, currentUser);
			});
		});
	});
});
