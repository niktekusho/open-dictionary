const nodemailer = require('nodemailer');

// TODO: dynamic require or dynamic export on the account creation function
const createAccount = require('./create-account');
const emailValidator = require('./email-message-validator');
const createTransporter = require('./create-email-transporter');
const sendEmail = require('./send-email');

module.exports = function (logger) {
	// First step: create the account, might be null in case of errors
	const account = createAccount(nodemailer, logger);

	// TODO Handle error by throwing
	if (account === null) {
		throw new Error('SMTP credentials creation failed');
	}

	const transporter = createTransporter(nodemailer, account);

	return {
		sendMail: message => sendEmail(message, emailValidator, transporter, logger)
	};
};
