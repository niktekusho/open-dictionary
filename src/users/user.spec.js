const user = require('./user');

describe('User module test suite', () => {
	describe('UserRole object test suite', () => {
		function addPropertyToUserRole() {
			'use strict';
			user.UserRole.test = 'test';
		}

		function updatePropertyToUserRole() {
			'use strict';
			user.UserRole.REVIEWER = 'test';
		}

		function removePropertyToUserRole() {
			'use strict';
			delete user.UserRole.REVIEWER;
		}

		it('UserRole should be an immutable object', () => {
			expect(Object.isFrozen(user.UserRole)).toBeTruthy();
			expect(() => addPropertyToUserRole()).toThrowError(TypeError);
			expect(() => updatePropertyToUserRole()).toThrowError(TypeError);
			expect(() => removePropertyToUserRole()).toThrowError(TypeError);
		});
	});
});
