const userServiceFactory = require('./user.service');

const adminUser = {
	id: 'somerandomuserid',
	user: 'user',
	passwordHash: 'ssdassfdafds',
	nativeLanguage: 'en-US',
	role: 1
};

const readonlyUser = {
	id: 'otherrandomuserid',
	user: 'user',
	passwordHash: 'ssdassfdafds',
	nativeLanguage: 'it-IT',
	role: 5
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
	async function mockFindImpl({id}) {
		return someUsers.filter(user => user.id === id);
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
			id: 'somerandomuserid'
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
			id: 'arandomuserid'
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
			id: 'somerandomuserid'
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
		return Object.assign({}, user, {id: userId});
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
		userRepository.create = jest.fn(mockCreateImpl);
		userRepository.find = jest.fn();
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			email: 'test',
			name: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			role: 1
		};
		const expectedUser = Object.assign({}, user, {id: 1});
		await expect(userService.createUser(user)).resolves.toStrictEqual(expectedUser);
		expect(userRepository.create).toHaveBeenCalledTimes(1);
		expect(userRepository.create).toHaveBeenCalledWith(user);
		expect(errorHandler).toHaveBeenCalledTimes(0);
	});

	it('createUser with repository failing', async () => {
		const err = new Error('Test');
		userRepository.create = jest.fn(() => {
			throw err;
		});
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			name: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			role: 1
		};
		await expect(userService.createUser(user)).resolves.toBeUndefined();
		expect(userRepository.create).toHaveBeenCalledTimes(1);
		expect(userRepository.create).toHaveBeenCalledWith(user);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(err, 'User creation failed');
	});

	it('createUser duplicate user', async () => {
		const err = new Error('Test');
		userRepository.create = jest.fn(() => {
			throw err;
		});
		userRepository.find = jest.fn(async user => user);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			email: 'test',
			name: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			role: 1
		};
		await expect(userService.createUser(user)).resolves.toBeUndefined();
		expect(userRepository.create).toHaveBeenCalledTimes(0);
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
			id: 'dassd',
			email: 'test',
			name: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			role: 1
		};
		userRepository.update = jest.fn(async (id, user) => user);
		userRepository.find = jest.fn(async () => user);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		await expect(userService.updateUser(user.id, user)).resolves.toStrictEqual(user);
		expect(userRepository.update).toHaveBeenCalledTimes(1);
		expect(userRepository.update).toHaveBeenCalledWith(user.id, user);
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
			id: 'dassd',
			name: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			role: 1
		};
		await expect(userService.updateUser(user.id, user)).resolves.toBeUndefined();
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
			id: 'dassd',
			name: 'test',
			email: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			role: 1
		};
		await expect(userService.updateUser(user.id, user)).resolves.toBeUndefined();
		expect(userRepository.update).toHaveBeenCalledTimes(0);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(null, `User update failed. User with id ${user.id} not found in the system.`);
	});
});

describe('Delete User test case', () => {
	beforeEach(() => {
		errorHandler = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('deleteUser success', async () => {
		const user = {
			id: 'dassd',
			email: 'test',
			name: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			role: 1
		};
		userRepository.delete = jest.fn(async () => true);
		userRepository.find = jest.fn(async () => user);
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		await expect(userService.deleteUser(user)).resolves.toStrictEqual(true);
		expect(userRepository.delete).toHaveBeenCalledTimes(1);
		expect(userRepository.delete).toHaveBeenCalledWith({id: user.id});
		expect(errorHandler).toHaveBeenCalledTimes(0);
	});
});
