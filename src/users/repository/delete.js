module.exports = async (username, logger, collection) => {
	if (username === null || username === undefined) {
		return null;
	}
	logger.debug(`Attempting remove of ${username}`);
	return collection.findOneAndDelete({username});
};
