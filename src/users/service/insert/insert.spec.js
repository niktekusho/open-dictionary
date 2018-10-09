const {
	validFakeUsers,
	fakeUsers
} = require('../../users-test-utils');
const insert = require('./insert');

describe('User service -> \'Insert\' test suite', () => {
	// ### MOCKS User repository mock
	const userRepository = {
		insert: jest.fn(async () => true),
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

	// Hash function is just an identity function for test purposes
	const hashMock = jest.fn(i => i);

	const emailService = {
		sendMail: jest.fn(() => Promise.resolve()),
		createEmail: jest.fn()
	};

	afterEach(() => {
		userRepository
			.insert
			.mockClear();
	});

	// ### END MOCKS

	it('insert should reject when an user is not passed in', async () => {
		// #1: Check for null
		await expect(insert(null, userRepository, logger, hashMock, emailService)).rejects.toThrowError(/(.*)(validation failed)/gi);

		// #2: Check for undefined
		await expect(insert(undefined, userRepository, logger, hashMock, emailService)).rejects.toThrowError(/(.*)((validation failed))(.*)/gi);
		// #3: Check that the repository is not called when the parameter is not
		// specified
		expect(userRepository.insert).toHaveBeenCalledTimes(0);
	});

	it('insert should reject when an invalid user is passed in', async () => {
		// #1: Check for invalid user
		await expect(insert(fakeUsers[0], userRepository, logger, hashMock, emailService)).rejects.toThrowError(/(.*)(validation failed)(.*)/gi);
		// #2: Check that the repository is not called when the user is not specified
		expect(userRepository.insert).toHaveBeenCalledTimes(0);
	});

	it('insert should reject when the repository fails', async () => {
		userRepository.find.mockImplementationOnce(() => Promise.resolve());
		userRepository
			.insert
			.mockImplementationOnce(() => Promise.reject());
		await expect(insert(validFakeUsers[0], userRepository, logger, hashMock, emailService)).rejects.toThrowError();

		// #2: Check that the repository is not called when the user is not specified
		expect(userRepository.insert).toHaveBeenCalledTimes(1);
	});

	it('insert should resolve when everything goes well', async () => {
		userRepository.find.mockImplementationOnce(() => Promise.resolve());
		await expect(insert(validFakeUsers[0], userRepository, logger, hashMock, emailService))
			.resolves
			.toEqual(true);
		expect(userRepository.insert).toHaveBeenCalledTimes(1);
	});
});
