module.exports = async (currentUser, updateUser, userRepository, logger) => {
	// #0: Check input data sanity
	if (currentUser === undefined || currentUser === null) {
		logger.debug('User service -> update -> current user is undefined');
		throw new Error('Current user is undefined');
	}

	if (updateUser === null || updateUser === undefined) {
		logger.debug('User service -> update -> update user object is undefined');
		return;
	}

	const {username: usernameToUpdate} = updateUser;
	const sameUser = currentUser.username === usernameToUpdate;

	if (sameUser) {
		logger.debug(`User service -> update -> ${currentUser.username} is trying to update itself`);
	} else {
		logger.debug(`User service -> update -> ${currentUser.username} is trying to update itself`);
	}

	// #1: Check that the current user has enough permissions to update
	logger.debug(`User ${currentUser.username} is trying to update ${usernameToUpdate}`);
	// if (isAdmin(currentUser) || currentUser.username === username) {
	// 	return userRepository.delete(username);
	// }
	// throw new Error(`User ${currentUser.username} does not have enough permissions to delete a user`);
};
