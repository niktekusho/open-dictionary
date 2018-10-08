module.exports = function (nodemailer, logger) {
	return new Promise((resolve, reject) => {
		nodemailer.createTestAccount((error, account) => {
			if (error) {
				logger.error(`Failed to create a test account: ${error.message}`);
				reject(error);
			}
			logger.info('Email credentials obtained.');
			resolve(account);
		});
	});
};
