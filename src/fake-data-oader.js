const {readFile} = require('fs');
const {promisify} = require('util');
const {resolve} = require('path');

module.exports = async (path, options) => {
	const promisifiedRead = promisify(readFile);
	const resolvedPath = resolve(__dirname, path);
	const fileContents = await promisifiedRead(resolvedPath, options);
	return JSON.parse(fileContents);
};
