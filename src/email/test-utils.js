module.exports = {
	emailTestAccount: {
		user: '',
		password: '',
		smtp: {
			host: '',
			port: '',
			secure: ''
		}
	},
	validMessage: {
		from: 'Sender <sender@example.com>',
		to: 'Recipient <recipient@example.com>',
		subject: 'Nodemailer is unicode friendly ✔',
		text: 'Hello world!',
		html: '<p><b>Hello</b> world!</p>'
	},
	missingFrom: {
		to: 'Recipient <recipient@example.com>',
		subject: 'Nodemailer is unicode friendly ✔',
		text: 'Hello world!',
		html: '<p><b>Hello</b> world!</p>'
	}
};
