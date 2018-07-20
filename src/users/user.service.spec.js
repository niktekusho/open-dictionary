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

process.on('unhandledRejection', reason => {
	console.log('REJECTION', reason);
});

const someUsers = [
	adminUser,
	readonlyUser
];

const userRepository = {};
let userService;
let errorHandler;

describe('get all users test suite', () => {
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

describe('get single user test suite', () => {
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

describe('create user test suite', () => {
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
		expect(users).toHaveLength(0);
		const expectedUser = Object.assign({}, user, {id: 1});
		await expect(userService.createUser(user)).resolves.toStrictEqual(expectedUser);
		expect(users).toHaveLength(1);
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
		expect(users).toHaveLength(0);
		await expect(userService.createUser(user)).resolves.toBeUndefined();
		expect(users).toHaveLength(0);
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
		userService = userServiceFactory({
			userRepository, errorHandler
		});
		const user = {
			name: 'test',
			passwordHash: 'dsafsamfdsmfòds',
			nativeLanguage: 'en-US',
			role: 1
		};
		expect(users).toHaveLength(0);
		await expect(userService.createUser(user)).resolves.toBeUndefined();
		expect(users).toHaveLength(0);
		expect(userRepository.create).toHaveBeenCalledTimes(1);
		expect(userRepository.create).toHaveBeenCalledWith(user);
		expect(errorHandler).toHaveBeenCalledTimes(1);
		expect(errorHandler).toHaveBeenCalledWith(err, 'User creation failed');
	});
});
