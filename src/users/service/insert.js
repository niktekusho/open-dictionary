const {isValidUser} = require('./validation-utils');

module.exports = async (user, userRepository, logger) => {
	if (user) {
		const validationResult = isValidUser(user);
		if (validationResult.valid) {
			try {
				logger.debug('User service -> Insert -> Valid user passed in');
				const repositoryResult = await userRepository.insert(user);
				return repositoryResult;
			} catch (error) {
				logger.debug('User service -> Insert -> Invalid user passed in');
				throw new Error(`Unexpected repository error.\n${error}`);
			}
		}
		throw new Error(`User validation failed:\n${validationResult.errors}`);
	}
	logger.debug('User service -> Insert -> Undefined user passed in');
	throw new Error('Inserting undefined user');
};
