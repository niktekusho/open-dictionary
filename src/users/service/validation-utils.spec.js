const {fakeUsers, validFakeUsers} = require('../test-utils');

const validationUtils = require('./validation-utils');

describe('User service -> \'Validation\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(validationUtils).toMatchObject(expect.any(Object));
			expect(validationUtils.isAdmin).toEqual(expect.any(Function));
			expect(validationUtils.isValidEmail).toEqual(expect.any(Function));
			expect(validationUtils.isValidUser).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
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

		it('isValidUser should return an object with valid = true if the user has all the re' +
                'quired properties',
		() => {
			const validations = validFakeUsers.map(user => validationUtils.isValidUser(user));
			validations.forEach(validation => expect(validation).toMatchObject({valid: true}));
		});

		it('isValidUser should return false, alongside an errors object indicating the reaso' +
                'n if the user does not ',
		() => {
			const validations = fakeUsers.map(user => validationUtils.isValidUser(user));
			validations.forEach(validation => expect(validation).toMatchObject({
				valid: false,
				details: expect.any(Object)
			}));
		});
	});
});
