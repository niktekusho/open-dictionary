const crypto = require('crypto');

function hashPassword(password) {
	const passwordHash = crypto.createHash('sha256')
		.update(password)
		.digest('hex');
	return passwordHash;
}

module.exports = hashPassword;
