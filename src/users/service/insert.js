const {isValidUser} = require('./validation-utils');

function throwServerError(cause) {

}

module.exports = async (user, userRepository, logger, hash) => {
	if (user) {
		const validationResult = isValidUser(user);
		if (validationResult.valid) {
			// Check if a user with the same username or email already exists
			let existingUser = null;
			try {
				existingUser = await userRepository.find(userRepository.queries.userExists(user.username, user.email));
			} catch (error) {
				throwServerError(error);
			}

			// If an existing user exists, find out which property is already taken (username or email)
			if (existingUser) {
				try {
					existingUser = await userRepository.find(userRepository.queries.equalsUsername(user.username));
				} catch (error) {
					throwServerError(error);
				}

				// If the "new" existingUser is defined then a user with the same username exists
				// otherwise it is a user with the same email that exists.
				if (existingUser) {
					const clientError = new Error('User with the same username already exists.');
					clientError
				}
			}

			try {
				user.passwordHash = hash(user.password);
				logger.debug('User service -> Insert -> Valid user passed in');
				const repositoryResult = await userRepository.insert(user);
				return repositoryResult;
			} catch (error) {
				logger.debug('User service -> Insert -> Invalid user passed in');
				throwServerError(error);
			}
		}
		const error = new Error('User validation failed');
		error.type = 'client';
		error.details = validationResult.details.map(detail => `User ${detail.message}`);
		throw error;
	}
	logger.debug('User service -> Insert -> Undefined user passed in');
	throw new Error('Inserting undefined user');
};
