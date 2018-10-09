const sendEmail = require('./send-email');
const testUtils = require('./test-utils');

describe('Email -> \'Send Email\' test suite', () => {
	const successSendCB = {messageId: 'id'};

	const transporterMock = {
		sendMail: jest.fn((msg, cb) => cb(null, successSendCB))
	};

	const validatorMock = jest.fn(() => ({isValid: true}));

	const loggerMock = {
		error: jest.fn(),
		debug: jest.fn()
	};

	const nodemailerMock = {
		getTestMessageUrl: jest.fn()
	};

	it('should resolve when everything is ok', async () => {
		const message = testUtils.validMessage;
		await expect(sendEmail(message, validatorMock, transporterMock, loggerMock, nodemailerMock)).resolves.toStrictEqual(successSendCB.messageId);
	});

	it('should reject when the email object is not valid', async () => {
		const message = testUtils.missingFrom;

		validatorMock.mockImplementationOnce(() => ({isValid: false, details: {message: 'blabla'}}));
		await expect(sendEmail(message, validatorMock, transporterMock, loggerMock, nodemailerMock)).rejects.toStrictEqual({message: 'blabla'});
	});

	it('should reject when the nodemailer fails', async () => {
		const message = testUtils.validMessage;
		transporterMock.sendMail.mockImplementationOnce((msg, cb) => cb(new Error('Some error')));
		await expect(sendEmail(message, validatorMock, transporterMock, loggerMock, nodemailerMock)).rejects.toThrowError('Some error');
	});
});
