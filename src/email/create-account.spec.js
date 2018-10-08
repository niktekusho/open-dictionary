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

	it('should create an account for smtp credentials when nodemailer succeeds', () => {
		const account = createAccount(nodemailerMock, loggerMock);
		expect(account).toStrictEqual(fakeAccount);
	});

	it('should NOT create an account for smtp credentials when nodemailer fails', () => {
		nodemailerMock.createTestAccount.mockImplementationOnce(cb => cb(new Error('Some error'), null));
		const account = createAccount(nodemailerMock, loggerMock);
		expect(account).toBeNull();
	});
});
