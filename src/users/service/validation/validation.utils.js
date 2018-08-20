const {validate} = require('isemail');

const {UserRole} = require('../../user');

module.exports = {
	isAdmin: user => user.roles.indexOf(UserRole.ADMIN) !== -1,
	isValidEmail: email => validate(email)
};
