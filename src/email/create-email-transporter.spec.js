const createTransporter = require('./create-email-transporter');
const {emailTestAccount} = require('./test-utils');

describe('Email -> \'Email Transporter\' test suite', () => {
	const nodemailerMock = {
		createTransport: jest.fn(() => ({sendMail: () => {}}))
	};

	it('should create an email transporter', () => {
		const transporter = createTransporter(nodemailerMock, emailTestAccount);
		expect(transporter).toBeDefined();
		expect(transporter).toHaveProperty('sendMail');
	});
});
