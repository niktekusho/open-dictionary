const user = require('./user');

describe('User module test suite', () => {
	it('User module should export objects', () => {
		expect(user).toBeDefined();
		expect(user.UserRole).toBeDefined();
	});
	describe('UserRole object test suite', () => {
		function addPropertyToUserRole() {
			'use strict';
			user.UserRole.test = 'test';
		}

		function updatePropertyToUserRole() {
			'use strict';
			user.UserRole.reviewer = 'test';
		}

		function removePropertyToUserRole() {
			'use strict';
			delete user.UserRole.reviewer;
		}

		it('UserRole should be an immutable object', () => {
			expect(Object.isFrozen(user.UserRole)).toBeTruthy();
			expect(() => addPropertyToUserRole()).toThrowError(TypeError);
			expect(() => updatePropertyToUserRole()).toThrowError(TypeError);
			expect(() => removePropertyToUserRole()).toThrowError(TypeError);
		});
	});
});
