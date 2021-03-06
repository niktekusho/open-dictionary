const {validate: validateMail} = require('isemail');
const Ajv = require('ajv');

const {UserRole} = require('../user');
const userSchema = require('../../../docs/user.json');
const Validation = require('../../validation');

// IIFE
module.exports = (() => {
	let jsonValidate = null;
	function lazyValidate() {
		if (jsonValidate === null || jsonValidate === undefined) {
			const ajv = new Ajv();
			jsonValidate = ajv.compile(userSchema);
			return jsonValidate;
		}
		return jsonValidate;
	}

	return {
		isAdmin: user => user.roles.indexOf(UserRole.ADMIN) !== -1,
		isValidEmail: email => validateMail(email),
		isValidUser: user => {
			const isValid = lazyValidate()(user);
			// Build the basic object which tells if the user is valid or not
			// If the user wasn't valid, the validate function of ajv has an errors property with the relevant errors.
			return new Validation(isValid, jsonValidate.errors);
		}
	};
})();
