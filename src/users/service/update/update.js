const {isAdmin} = require('../validation-utils');

function isNotDefined(obj) {
	return obj === null || obj === undefined;
}

async function handleUpdate(username, updateUser, userRepository, logger) {
	try {
		const res = await userRepository.update(username, updateUser);
		logger.debug(res);
		return `User ${username} updated`;
	} catch (error) {
		logger.error(error);
		throw new Error('User service -> update -> update failed');
	}
}

module.exports = async (currentUser, updateUser, userRepository, logger) => {
	// #0: Check input data sanity
	if (isNotDefined(currentUser)) {
		logger.debug('User service -> update -> current user is undefined');
		throw new Error('Current user is undefined');
	}

	if (isNotDefined(updateUser)) {
		logger.debug('User service -> update -> update user object is undefined');
		return;
	}

	const {username: usernameToUpdate} = updateUser;
	const sameUser = currentUser.username === usernameToUpdate;

	if (sameUser) {
		logger.debug(`User service -> update -> ${currentUser.username} is trying to update itself`);
		return handleUpdate(usernameToUpdate, updateUser, userRepository, logger);
	}

	logger.debug(`User service -> update -> ${currentUser.username} is trying to update ${usernameToUpdate}`);
	if (isAdmin(currentUser)) {
		logger.debug(`User service -> update -> ${currentUser.username} with admin permissions is trying to update ${usernameToUpdate}`);
		return handleUpdate(usernameToUpdate, updateUser, userRepository, logger);
	}
	throw new Error(`User ${currentUser.username} does not have enough permissions to delete an other user`);
};
