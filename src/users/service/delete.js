const {isAdmin} = require('./validation.utils');

module.exports = async (currentUser, username, userRepository, logger) => {
	logger.debug(`User ${currentUser.username} is trying to delete ${username}`);
	if (isAdmin(currentUser) || currentUser.username === username) {
		return userRepository.delete(username);
	}
	throw new Error(`User ${currentUser.username} does not have enough permissions to delete a user`);
};
