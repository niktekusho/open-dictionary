const {fakeUsers, validFakeUsers} = require('../users-test-utils');

const validationUtils = require('./validation-utils');

describe('User service -> \'Validation\' test suite', () => {
	it('isAdmin should return true if the user includes the ADMIN role', () => {
		const user = {
			roles: ['ADMIN', 'REVIEWER', 'READER', 'WRITER']
		};
		expect(validationUtils.isAdmin(user)).toEqual(true);
	});

	it('isAdmin should return false if the user dows not include the ADMIN role', () => {
		const user = {
			roles: ['REVIEWER', 'READER', 'WRITER']
		};
		expect(validationUtils.isAdmin(user)).toEqual(false);
	});

	it('isValidEmail should return true according to RFCs 5321, 5322, and others', () => {
		validFakeUsers.forEach(user => expect(validationUtils.isValidEmail(user.email)).toEqual(true));
	});

	it('isValidUser should return an object with valid = true if the user has all the required properties', () => {
		const validations = validFakeUsers.map(user => validationUtils.isValidUser(user));
		validations.forEach(validation => expect(validation).toMatchObject({
			valid: true
		}));
	});

	it('isValidUser should return false, alongside an errors object indicating the reason if the user does not ', () => {
		const validations = fakeUsers.map(user => validationUtils.isValidUser(user));
		validations.forEach(validation => expect(validation).toMatchObject({
			valid: false,
			details: expect.any(Object)
		}));
	});
});
