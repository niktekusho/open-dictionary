module.exports = async (userRepository, username, projection, logger) => {
	logger.debug(`Attempting retrieve of user with ${username}, using the projection ${projection}`);
	return userRepository.find(userRepository.queries.equalsUsername(username), projection);
};
