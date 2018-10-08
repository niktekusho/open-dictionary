const nodemailer = require('nodemailer');

// TODO: dynamic require or dynamic export on the account creation function
const createAccount = require('./create-account');
const emailValidator = require('./email-message-validator');
const createTransporter = require('./create-email-transporter');
const sendEmail = require('./send-email');
const createEmail = require('./email-factory');

module.exports = async function (logger) {
	// First step: create the account, cannot be null in case of errors (whole function throws)
	const account = await createAccount(nodemailer, logger);

	const transporter = createTransporter(nodemailer, account);

	return {
		sendMail: async message => sendEmail(message, emailValidator, transporter, logger),
		createEmail
	};
};
