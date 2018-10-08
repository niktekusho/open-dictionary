module.exports = function (nodemailer, account) {
	// Create a SMTP transporter object
	return nodemailer.createTransport({
		host: account.smtp.host,
		port: account.smtp.port,
		secure: account.smtp.secure,
		auth: {
			user: account.user,
			pass: account.pass
		}
	});
};
