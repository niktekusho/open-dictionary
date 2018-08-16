module.exports = async ({
	username,
	fullname,
	email,
	passwordHash,
	nativeLanguage,
	roles
}, logger, collection) => {
	const obj = {
		fullname,
		username,
		email,
		passwordHash,
		nativeLanguage,
		roles,
		metadata: {
			creationDate: new Date()
		}
	};
	logger.debug(JSON.stringify(obj));
	return collection.insertOne(obj);
};
