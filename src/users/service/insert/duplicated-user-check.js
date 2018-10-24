const {createClientError, createServerError} = require('../../../errors');

module.exports = async (user, userRepository, logger) => {
	logger.debug(user);
	if (user) {
		// Check if a user with the same username or email already exists
		let existingUser = null;

		try {
			existingUser = await userRepository.find(userRepository.queries.existingUser(user.username, user.email));
		} catch (error) {
			throw createServerError(error, 'User repository find failed.');
		}

		// If an existing user exists, find out which property is already taken (username or email)
		if (existingUser) {
			if (existingUser.username === user.username) {
				throw createClientError('User with the same username already exists.', 409);
			}
			throw createClientError('User with the same email already exists.', 409);
		}
	} else {
		throw createClientError('Undefined user.', 406);
	}
};
