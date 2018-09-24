const find = require('./find/find');
const _update = require('./update/update');
const _delete = require('./delete');
const _insert = require('./insert');

function init(userRepository, logger) {
	return {
		createUser: userData => _insert(userData, userRepository, logger),
		deleteUser: (currentUser, username) => _delete(currentUser, username, userRepository, logger),
		findUserByEmail: (email, projection) => find.findByEmail(userRepository, email, projection, logger),
		findUserByUsername: (username, projection) => find.findByUsername(userRepository, username, projection, logger),
		getUsers: () => userRepository.find({}, userRepository.projections.minimal),
		updateUser: (currentUser, userData) => _update(currentUser, userData, userRepository, logger)
	};
}

module.exports = init;
