const {isValidUser} = require('../validation-utils');
const {createServerError, createClientError} = require('../../../errors');
const checkUserExistance = require('./duplicated-user-check');

module.exports = async (user, userRepository, logger, hash) => {
	if (user) {
		const validationResult = isValidUser(user);
		if (validationResult.valid) {
			// Check if a user with the same username or email already exists
			// Throwed errors already in the correct format so not catching is fine
			await checkUserExistance(user, userRepository, logger);

			try {
				user.passwordHash = hash(user.password);
				logger.debug('User service -> Insert -> Valid user passed in');
				const repositoryResult = await userRepository.insert(user);
				return repositoryResult;
			} catch (error) {
				logger.debug('User service -> Insert -> Invalid user passed in');
				throw createServerError(error, 'Invalid user passed in');
			}
		}

		throw createClientError('User validation failed', 406, validationResult.details.map(detail => `User ${detail.message}`));
	}
	logger.debug('User service -> Insert -> Undefined user passed in');
	throw createClientError('User validation failed', 406, 'Undefined user passed in');
};
