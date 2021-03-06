const nodemailerMock = require('nodemailer');

const emailService = require('./email-service');
const {emailTestAccount} = require('./test-utils');

describe('Email -> \'Email Service\' test suite', () => {
	const loggerMock = {
		debug: jest.fn(),
		error: jest.fn(),
		info: jest.fn()
	};

	nodemailerMock.createTestAccount = jest.fn(cb => cb(null, emailTestAccount));

	it('should use the dev environment for email service creation', async () => {
		await expect(emailService(loggerMock)).resolves.toMatchObject({sendMail: expect.any(Function)});
	});

	it('should throw when it cannot create the dev credentials', async () => {
		nodemailerMock.createTestAccount.mockImplementationOnce(cb => cb(new Error()));
		await expect(emailService(loggerMock)).rejects.toThrowError();
	});
});
