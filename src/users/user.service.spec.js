const userServiceFactory = require('./user.service');

const adminUser = {
	username: 'somerandomuserid',
	fullname: 'user',
	passwordHash: 'ssdassfdafds',
	nativeLanguage: 'en-US',
	roles: [1]
};

const readonlyUser = {
	username: 'otherrandomuserid',
	fullname: 'user',
	passwordHash: 'ssdassfdafds',
	nativeLanguage: 'it-IT',
	roles: [4]
};

const someUsers = [
	adminUser,
	readonlyUser
];

const userRepository = {};
let userService;
let errorHandler;

describe('Get Users test suite', () => {
	beforeEach(() => {
		errorHandler = jest.fn();
	});

	it('getUsers with empty repository', async () => {
		userRepository.find = jest.fn(async () => []);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		await expect(userService.getUsers()).resolves.toEqual([]);
		expect(userRepository.find).toHaveBeenCalledTimes(1);
		expect(userRepository.find).toHaveBeenCalledWith();

		expect(errorHandler).toHaveBeenCalledTimes(0);
	});
	it('getUsers with some repository', async () => {
		userRepository.find = jest.fn(async () => [
			adminUser,
			readonlyUser
		]);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		await expect(userService.getUsers()).resolves.toHaveLength(2);
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

		// The mocked errorHandler function does not return -> service should return undefined
		await expect(userService.getUsers()).resolves.toBeUndefined();
		expect(userRepository.find).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(err, 'Users retrieval failed');
	});
});

describe('Get User test suite', () => {
	async function mockFindImpl({username}) {
		return someUsers.filter(user => user.username === username);
	}

	beforeEach(() => {
		errorHandler = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('getUser found', async () => {
		userRepository.find = jest.fn(mockFindImpl);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const userId = {
			username: 'somerandomuserid'
		};
		await expect(userService.getUser(userId)).resolves.toStrictEqual([adminUser]);
		expect(userRepository.find).toHaveBeenCalledTimes(1);
		expect(userRepository.find).toHaveBeenCalledWith(userId);
		expect(errorHandler).toHaveBeenCalledTimes(0);
	});

	it('getUser not found (not in repository)', async () => {
		userRepository.find = jest.fn(mockFindImpl);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const userId = {
			username: 'arandomuserid'
		};
		await expect(userService.getUser(userId)).resolves.toStrictEqual([]);
		expect(userRepository.find).toHaveBeenCalledTimes(1);
		expect(userRepository.find).toHaveBeenCalledWith(userId);
		expect(errorHandler).toHaveBeenCalledTimes(0);
	});

	it('getUser not found (repository throws error)', async () => {
		const err = new Error('Test');
		userRepository.find = jest.fn(async () => {
			throw err;
		});
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const userId = {
			username: 'somerandomuserid'
		};
		await expect(userService.getUser(userId)).resolves.toBeUndefined();
		expect(userRepository.find).toHaveBeenCalledTimes(1);
		expect(userRepository.find).toHaveBeenCalledWith(userId);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(err, 'User retrieval failed');
	});
});

describe('Create User test suite', () => {
	let users = [];

	async function mockCreateImpl(user) {
		const userId = users.push(user);
		return Object.assign({}, user, {username: userId});
	}

	beforeEach(() => {
		errorHandler = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
		// Reset users array
		users = [];
	});

	it('createUser success', async () => {
		userRepository.insert = jest.fn(mockCreateImpl);
		userRepository.find = jest.fn();
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			email: 'test',
			username: 'test',
			fullname: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			roles: 1
		};
		const expectedUser = Object.assign({}, user, {username: 1});
		await expect(userService.createUser(user)).resolves.toStrictEqual(expectedUser);
		expect(userRepository.insert).toHaveBeenCalledTimes(1);
		expect(userRepository.insert).toHaveBeenCalledWith(user);
		expect(errorHandler).toHaveBeenCalledTimes(0);
	});

	it('createUser with repository failing', async () => {
		const err = new Error('Test');
		userRepository.insert = jest.fn(() => {
			throw err;
		});
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			username: 'test',
			fullname: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			roles: 1
		};
		await expect(userService.createUser(user)).resolves.toBeUndefined();
		expect(userRepository.insert).toHaveBeenCalledTimes(1);
		expect(userRepository.insert).toHaveBeenCalledWith(user);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(err, 'User creation failed');
	});

	it('createUser duplicate user', async () => {
		const err = new Error('Test');
		userRepository.insert = jest.fn(() => {
			throw err;
		});
		userRepository.find = jest.fn(async user => user);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			email: 'test',
			username: 'test',
			fullname: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			roles: 1
		};
		await expect(userService.createUser(user)).resolves.toBeUndefined();
		expect(userRepository.insert).toHaveBeenCalledTimes(0);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(null, `User creation failed. Email ${user.email} already in the system.`);
	});
});

describe('Update User test suite', () => {
	beforeEach(() => {
		errorHandler = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('updateUser success', async () => {
		const user = {
			username: 'dassd',
			email: 'test',
			fullname: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			roles: [1]
		};
		userRepository.update = jest.fn(async (username, user) => user);
		userRepository.find = jest.fn(async () => user);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		await expect(userService.updateUser(user.username, user)).resolves.toStrictEqual(user);
		expect(userRepository.update).toHaveBeenCalledTimes(1);
		expect(userRepository.update).toHaveBeenCalledWith(user.username, user);
		expect(errorHandler).toHaveBeenCalledTimes(0);
	});

	it('updateUser with repository failing', async () => {
		const err = new Error('Test');
		userRepository.update = jest.fn(() => {
			throw err;
		});
		userRepository.find = jest.fn(async user => user);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			username: 'dassd',
			fullname: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			roles: [1]
		};
		await expect(userService.updateUser(user.username, user)).resolves.toBeUndefined();
		expect(userRepository.update).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(err, 'User update failed');
	});

	it('updateUser user not found', async () => {
		userRepository.find = jest.fn(async () => undefined);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			username: 'dassd',
			name: 'test',
			email: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			roles: [1]
		};
		await expect(userService.updateUser(user.username, user)).resolves.toBeUndefined();
		expect(userRepository.update).toHaveBeenCalledTimes(0);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(null, `User update failed. User with username ${user.username} not found in the system.`);
	});
});

describe('Delete User test case', () => {
	beforeEach(() => {
		errorHandler = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	const user = {
		username: 'dassd',
		email: 'test',
		name: 'test',
		passwordHash: 'dsafsamfdsmfòds',
		nativeLanguage: 'en-US',
		roles: [1]
	};
	it('deleteUser success', async () => {
		userRepository.delete = jest.fn(async () => true);
		userRepository.find = jest.fn(async () => user);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		await expect(userService.deleteUser(user)).resolves.toStrictEqual(true);
		expect(userRepository.delete).toHaveBeenCalledTimes(1);
		expect(userRepository.delete).toHaveBeenCalledWith({username: user.username});
		expect(errorHandler).toHaveBeenCalledTimes(0);
	});

	it('deleteUser username not found', async () => {
		userRepository.delete = jest.fn(async () => true);
		userRepository.find = jest.fn(async () => undefined);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		await expect(userService.deleteUser(user)).resolves.toBeUndefined();
		expect(userRepository.delete).toHaveBeenCalledTimes(0);
		expect(userRepository.find).toHaveBeenCalledWith({username: user.username});
		expect(errorHandler).toHaveBeenCalledWith(null, `User delete failed. User with username ${user.username} not found in the system.`);
		expect(errorHandler).toHaveBeenCalledTimes(1);
	});

	it('deleteUser user repository fails', async () => {
		const err = new Error('test');
		userRepository.delete = jest.fn(async () => {
			throw err;
		});
		userRepository.find = jest.fn(async () => user);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		await expect(userService.deleteUser(user)).resolves.toBeUndefined();
		expect(userRepository.delete).toHaveBeenCalledTimes(1);
		expect(userRepository.find).toHaveBeenCalledWith({username: user.username});
		expect(errorHandler).toHaveBeenCalledWith(err, 'User delete failed');
		expect(errorHandler).toHaveBeenCalledTimes(1);
	});
});
