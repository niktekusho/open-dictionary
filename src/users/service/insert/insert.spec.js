const {validFakeUsers, fakeUsers} = require('../../../test-utils');
const insert = require('./insert');

describe('User service -> \'Insert\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(insert).toEqual(expect.any(Function));
		});
	});

	// ### MOCKS User repository mock
	const userRepository = {
		insert: jest.fn(async () => true),
		find: jest.fn(Promise.resolve),
		queries: {
			userExists: jest.fn(Promise.resolve),
			equalsUsername: jest.fn(Promise.resolve)
		}
	};

	// Logger mock
	const logger = {
		debug: jest.fn()
	};

	// Hash function is just an identity function for test purposes
	const hashMock = jest.fn(i => i);

	afterEach(() => {
		userRepository
			.insert
			.mockClear();
	});

	// ### END MOCKS

	describe('Evaluating module functionality', () => {
		it('insert should reject when an user is not passed in', async () => {
			// #1: Check for null
			try {
				await insert(null, userRepository, logger, hashMock);
			} catch (error) {
				expect(error).toEqual(expect.any(Error));
				expect(error.message).toMatch(/(.*)(validation failed)/gi);
			}

			// #2: Check for undefined
			try {
				await insert(undefined, userRepository, logger, hashMock);
			} catch (error) {
				expect(error).toEqual(expect.any(Error));
				expect(error.message).toMatch(/(.*)((validation failed))(.*)/gi);
			}
			// #3: Check that the repository is not called when the parameter is not
			// specified
			expect(userRepository.insert).toHaveBeenCalledTimes(0);
		});

		it('insert should reject when an invalid user is passed in', async () => {
			// #1: Check for invalid user
			await expect(insert(fakeUsers[0], userRepository, logger, hashMock)).rejects.toThrowError(/(.*)(validation failed)(.*)/gi);
			// #2: Check that the repository is not called when the user is not specified
			expect(userRepository.insert).toHaveBeenCalledTimes(0);
		});

		it('insert should reject when the repository fails', async () => {
			userRepository
				.insert
				.mockImplementationOnce(() => Promise.reject());
			await expect(insert(validFakeUsers[0], userRepository, logger, hashMock)).rejects.toThrowError();

			// #2: Check that the repository is not called when the user is not specified
			expect(userRepository.insert).toHaveBeenCalledTimes(1);
		});

		it('insert should resolve when everything goes well', async () => {
			await expect(insert(validFakeUsers[0], userRepository, logger, hashMock))
				.resolves
				.toEqual(true);
			expect(userRepository.insert).toHaveBeenCalledTimes(1);
		});
	});
});
