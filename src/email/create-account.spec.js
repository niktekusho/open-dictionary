const createAccount = require('./create-account');
const {fakeAccount} = require('./test-utils');

describe('Email -> \'SMTP Account\' test suite', () => {
	const nodemailerMock = {
		createTestAccount: jest.fn(cb => cb(null, fakeAccount))
	};

	const loggerMock = {
		error: jest.fn(),
		info: jest.fn()
	};

	it('should create an account for smtp credentials when nodemailer succeeds', async () => {
		await expect(createAccount(nodemailerMock, loggerMock)).resolves.toStrictEqual(fakeAccount);
	});

	it('should NOT create an account for smtp credentials when nodemailer fails', async () => {
		nodemailerMock.createTestAccount.mockImplementationOnce(cb => cb(new Error('Some error'), null));
		await expect(createAccount(nodemailerMock, loggerMock)).rejects.toThrowError('Some error');
	});
});
