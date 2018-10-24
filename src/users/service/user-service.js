const find = require('./find/find');
const _update = require('./update/update');
const _delete = require('./delete');
const _insert = require('./insert/insert');
const _authenticate = require('./auth/authenticate-user');
const hash = require('./auth/hash-password');

function init(userRepository, logger) {
	return {
		authenticate: (username, password) => _authenticate(userRepository, logger, username, password),
		createUser: (userData, emailService) => _insert(userData, userRepository, logger, hash, emailService),
		deleteUser: (currentUser, username) => _delete(currentUser, username, userRepository, logger),
		findUserByEmail: (email, projection) => find.findByEmail(userRepository, email, projection, logger),
		findUserByUsername: (username, projection) => find.findByUsername(userRepository, username, projection, logger),
		getUsers: () => userRepository.find({}, userRepository.projections.minimal),
		updateUser: (currentUser, userData) => _update(currentUser, userData, userRepository, logger)
	};
}

module.exports = init;
