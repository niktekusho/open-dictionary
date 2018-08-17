module.exports = async (user, logger, {collection, insertOpts = {}}) => {
	if (user === null || user === undefined) {
		return null;
	}
	logger.debug(JSON.stringify(user));
	if (Array.isArray(user)) {
		return collection.insertMany(user, insertOpts);
	}
	return collection.insertOne(user, insertOpts);
};
