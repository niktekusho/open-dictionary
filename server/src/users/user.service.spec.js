const userServiceFactory = require('./user.service');

describe('User service test suite', () => {
	const adminUser = {
		user: 'user',
		passwfordHash: 'ssdassfdafds',
		nativeLanguage: 'en-US',
		role: 1
	};

	const readonlyUser = {
		user: 'user',
		passwordHash: 'ssdassfdafds',
		nativeLanguage: 'it-IT',
		role: 5
	};

	const userRepository = {};
	let userService;
	let errorHandler;

	describe('get all users test suite', () => {
		beforeEach(() => {
			errorHandler = jest.fn();
		});

		it('getUsers with empty repository', () => {
			userRepository.find = jest.fn(async () => []);
			userService = userServiceFactory({
				userRepository, errorHandler
			});
			expect(userService.getUsers()).resolves.toEqual([]);
			expect(userRepository.find).toHaveBeenCalledTimes(1);
			expect(userRepository.find).toHaveBeenCalledWith();

			expect(errorHandler).toHaveBeenCalledTimes(0);
		});
		it('getUsers with some repository', () => {
			userRepository.find = jest.fn(async () => [
				adminUser,
				readonlyUser
			]);
			userService = userServiceFactory({
				userRepository, errorHandler
			});
			expect(userService.getUsers()).resolves.toHaveLength(2);
			expect(userRepository.find).toHaveBeenCalledTimes(1);
			expect(userRepository.find).toHaveBeenCalledWith();

			expect(errorHandler).toHaveBeenCalledTimes(0);
		});
		it('getUsers error inside repository', async () => {
			const err = new Error('Test');
			userRepository.find = jest.fn(async () => {
				throw err;
			});
			userService = userServiceFactory({
				userRepository, errorHandler
			});
			const serviceResponse = await userService.getUsers();
			// The mocked errorHandler function does not return -> service should return undefined
			expect(serviceResponse).toBeUndefined();
			expect(userRepository.find).toHaveBeenCalledTimes(1);
			expect(errorHandler).toHaveBeenCalledTimes(1);
			expect(errorHandler).toHaveBeenCalledWith(err, 'Users retrieval failed');
		});
	});
});
