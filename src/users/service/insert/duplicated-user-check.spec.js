const {validFakeUsers} = require('../../users-test-utils');
const userCheck = require('./duplicated-user-check');

describe('User service -> \'User Check\' test suite', () => {
	// ### MOCKS User repository mock
	const userRepository = {
		find: jest.fn(() => Promise.resolve()),
		queries: {
			existingUser: jest.fn(),
			equalsUsername: jest.fn()
		}
	};

	// Logger mock
	const logger = {
		debug: jest.fn()
	};

	afterEach(() => userRepository.find.mockClear());

	// ### END MOCKS
	it('user-check should reject when an user is not passed in', async () => {
		const errorRegex = /(.*)((undefined user)|(user undefined))(.*)/gi;

		// #1: Check for null
		await expect(userCheck(null, userRepository, logger)).rejects.toThrowError(errorRegex);

		// #2: Check for undefined
		await expect(userCheck(undefined, userRepository, logger)).rejects.toThrowError(errorRegex);
	});

	it('user-check should reject when an user with the same username is found', async () => {
		const user = validFakeUsers[0];
		userRepository.find.mockImplementationOnce(() => Promise.resolve(user));
		await expect(userCheck(user, userRepository, logger)).rejects.toThrowError(/(.*)(username)(.*)/gi);
	});

	it('user-check should reject when an user with the same email is found', async () => {
		const user = validFakeUsers[0];
		userRepository.find.mockImplementationOnce(() => Promise.resolve(user));
		const userCopy = {...user, username: 'test'};
		await expect(userCheck(userCopy, userRepository, logger)).rejects.toThrowError(/(.*)(email)(.*)/gi);
	});

	it('user-check should resolve when an existing user is not found', async () => {
		const user = validFakeUsers[1];
		userRepository.find.mockImplementationOnce(() => Promise.resolve());
		await expect(userCheck(user, userRepository, logger)).resolves.toBeUndefined();
	});
});
