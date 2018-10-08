const userServiceFactory = require('./user-service');

// Require the features that are going to be mocked
const find = require('./find/find');
const update = require('./update/update');
const deleteUser = require('./delete');
const insertUser = require('./insert/insert');

// Mock them all!
jest.mock('./find/find');
jest.mock('./update/update');
jest.mock('./delete');
jest.mock('./insert/insert');

describe('User service -> \'Factory\' test suite', () => {
	const userRepositoryMock = {};
	const loggerMock = {};

	let userService;

	beforeAll(() => {
		userService = userServiceFactory(userRepositoryMock, loggerMock);
	});

	/*
		Since the individual features are already tested with their own file,
		I am just going to check the functions' existance and that the corre(ct invocation is made.
	*/
	it('invocating the function should return an object', () => {
		expect(userService).toBeDefined();
	});

	it('the returned object should contain the find by email feature', async () => {
		expect(userService.findUserByEmail).toBeDefined();
		await userService.findUserByEmail('test');
		expect(find.findByEmail).toHaveBeenCalledTimes(1);
		expect(find.findByEmail).toHaveBeenCalledWith(userRepositoryMock, 'test', undefined, loggerMock);
	});

	it('the returned object should contain the find by username feature', async () => {
		expect(userService.findUserByUsername).toBeDefined();
		await userService.findUserByUsername('test');
		expect(find.findByUsername).toHaveBeenCalledTimes(1);
		expect(find.findByUsername).toHaveBeenCalledWith(userRepositoryMock, 'test', undefined, loggerMock);
	});

	it('the returned object should contain the delete feature', async () => {
		expect(userService.deleteUser).toBeDefined();
		await userService.deleteUser({}, 'test');
		expect(deleteUser).toHaveBeenCalledTimes(1);
		expect(deleteUser).toHaveBeenCalledWith({}, 'test', userRepositoryMock, loggerMock);
	});

	it('the returned object should contain the create new user feature', async () => {
		expect(userService.createUser).toBeDefined();
		await userService.createUser({});
		expect(insertUser).toHaveBeenCalledTimes(1);
		expect(insertUser).toHaveBeenCalledWith({}, userRepositoryMock, loggerMock, expect.any(Function));
	});

	it('the returned object should contain the update feature', async () => {
		expect(userService.updateUser).toBeDefined();
		await userService.updateUser({
			current: 'user'
		}, {});
		expect(update).toHaveBeenCalledTimes(1);
		expect(update).toHaveBeenCalledWith({
			current: 'user'
		}, {}, userRepositoryMock, loggerMock);
	});
});
