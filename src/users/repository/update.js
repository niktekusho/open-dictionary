module.exports = async ({username, newUser}, logger, collection) => {
	// UsernameToUpdate and newUser are mandatory
	if (username === null || username === undefined) {
		throw new Error('Update failed: missing the user\'s username');
	}

	if (newUser === null || newUser === undefined) {
		throw new Error('Update failed: missing the user entity param');
	}

	const debugString = `username: ${username}, newUser: ${newUser}`;
	logger.debug(debugString);
	try {
		const updatedUser = await collection.findOneAndUpdate({username}, {$set: newUser});
		return updatedUser;
	} catch (err) {
		throw new Error(`Update failed: ${err.message}`);
	}
};
