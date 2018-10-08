module.exports = async function (emailMsg, emailValidator, emailTransporter, logger) {
	// Some validation first
	return new Promise((resolve, reject) => {
		const emailValidation = emailValidator(emailMsg);
		if (emailValidation.isValid) {
			// The email object has all the required properties, so let's try to send it
			emailTransporter.sendMail(emailMsg, (error, info) => {
				if (error) {
					logger.error(`Error occurred: ${error.message}`);
					reject(error);
				}

				logger.info(`Message sent: ${info.messageId}`);
				resolve(info.messageId);
				// Preview only available when sending through an Ethereal account
				// console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			});
		} else {
			// reject the promise giving the details
			reject(emailValidation.details);
		}
	});
};

// Message object
// let message = {
// from: sender,
// to: 'Recipient <recipient@example.com>',
// subject: 'Nodemailer is unicode friendly ✔',
// text: 'Hello world!',
// html: '<p><b>Hello</b> world!</p>'
// };
