module.exports = function (nodemailer, logger) {
	return nodemailer.createTestAccount((err, account) => {
		if (err) {
			logger.error(`Failed to create a test account: ${err.message}`);
			return null;
		}
		logger.info('Email credentials obtained.');
		return account;
	});
};
