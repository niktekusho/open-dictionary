const hashPassword = require('./hash-password');

function createAuthError() {
	const error = new Error('Authentication error');
	return error;
}

async function authenticate(userRepository, logger, username, password) {
	let user = null;
	logger.debug(`Attempting ${username} authentication`);
	try {
		// If the user exists we process the authentication
		user = await userRepository.find(userRepository.queries.equalsUsername(username));
	} catch (error) {
		// Otherwise log the error and throw a generic authentication error
		logger.error(`User with username ${username} not found`, error);
		throw createAuthError();
	}

	// Here user must be defined
	// The other thing we must check is the password and at this level we presume the password is NOT hashed
	// TODO evaluate the creation of a custom object for auth purposes that prevents password logging
	const passwordHash = hashPassword(password);

	if (passwordHash === user.passwordHash) {
		return true;
	}
	throw createAuthError();
}

module.exports = authenticate;
