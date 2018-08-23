module.exports = async (userRepository, email, projection, logger) => {
	logger.debug(`Attempting retrieve of user with ${email}, using the projection ${projection}`);
	return userRepository.find(userRepository.queries.equalsEmail(email), projection);
};
