const validator = require('./email-message-validator');

describe('Email -> \'Email Validator\' test suite', () => {
	it('should return a truthy validation object with a correct message', () => {
		const message = {
			from: 'Sender <sender@example.com>',
			to: 'Recipient <recipient@example.com>',
			subject: 'Nodemailer is unicode friendly ✔',
			text: 'Hello world!',
			html: '<p><b>Hello</b> world!</p>'
		};
		const result = validator(message);
		expect(result.isValid).toEqual(true);
		expect(result.details).toEqual({});
	});

	it('should return a falsy validation object with an undefined or null object', () => {
		// First check for null
		let result = validator(null);
		expect(result.isValid).toEqual(false);
		expect(result.details).toHaveProperty('message');

		// Then check for undefined
		result = validator(undefined);
		expect(result.isValid).toEqual(false);
		expect(result.details).toHaveProperty('message');
	});
});
