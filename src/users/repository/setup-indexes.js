module.exports = async collection => {
	await collection.createIndex({email: 1}, {unique: true});
	await collection.createIndex({username: 1}, {unique: true});
};
