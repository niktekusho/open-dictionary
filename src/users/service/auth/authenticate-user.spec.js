const authenticateUser = require('./authenticate-user');
const hashPassword = require('./hash-password');

describe('Authenticate function test suite', () => {
	const userRepositoryMock = {
		find: jest.fn(),
		queries: {
			equalsUsername: () => {}
		}
	};

	const loggerMock = {
		debug: jest.fn(),
		error: jest.fn()
	};

	const username = 'test';
	const psw = 'test';

	it('not existing user should throw an auth error', async () => {
		userRepositoryMock.find.mockImplementationOnce(Promise.reject);
		await expect(authenticateUser(userRepositoryMock, loggerMock, username, psw)).rejects.toEqual(new Error('Authentication error'));
	});

	it('user with wrong password should throw an auth error', async () => {
		const wrongPassword = psw + '1';
		const wrongPasswordHash = hashPassword(wrongPassword);
		userRepositoryMock.find.mockImplementationOnce(() => Promise.resolve({passwordHash: wrongPasswordHash}));
		await expect(authenticateUser(userRepositoryMock, loggerMock, username, psw)).rejects.toEqual(new Error('Authentication error'));
	});

	it('user with correct password should resolve', async () => {
		const okPasswordHash = hashPassword(psw);
		userRepositoryMock.find.mockImplementationOnce(() => Promise.resolve({passwordHash: okPasswordHash}));
		await expect(authenticateUser(userRepositoryMock, loggerMock, username, psw)).resolves;
	});
});
