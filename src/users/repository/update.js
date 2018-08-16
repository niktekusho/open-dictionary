module.exports = async (usernameToUpdate, {
	email, fullname, username, passwordHash, nativeLanguage, role
}, logger, collection) => {
	logger.log('TODO', {username, email, fullname, passwordHash, nativeLanguage, role});
	logger.log(collection);
	logger.log(usernameToUpdate);
};
