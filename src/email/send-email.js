module.exports = async function (emailMsg, emailValidator, emailTransporter, logger, nodemailer) {
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

				logger.debug(`Message sent: ${nodemailer.getTestMessageUrl(info)}`);
				resolve(info.messageId);
				// Preview only available when sending through an Ethereal account
				// console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
			});
		} else {
			// Reject the promise giving the details
			reject(emailValidation.details);
		}
	});
};
