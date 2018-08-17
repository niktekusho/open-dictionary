module.exports = async ({unboxArray}, logger, {
	collection,
	query = {},
	projection = {}
}) => {
	logger.debug(query);
	const dbResponse = await collection.find(query, projection).toArray();
	logger.debug(dbResponse);
	return unboxArray(dbResponse);
};
