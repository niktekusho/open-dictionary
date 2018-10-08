const createEmail = require('./email-factory');

describe('Email -> \'Create Email\' test suite', () => {
	it('should create an object', () => {
		const email = createEmail('from', 'to', 'subject', 'content');
		expect(email).toStrictEqual({
			from: 'from',
			to: 'to',
			subject: 'subject',
			text: 'content',
			html: 'content'
		});
	});
});
