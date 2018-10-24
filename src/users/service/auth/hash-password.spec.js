const hashPassword = require('./hash-password');

describe('Password hashing function test suite', () => {
	it('should return the hash of the specified string', () => {
		const psw1 = 'test';
		const hashedPassword = hashPassword(psw1);
		// Well... must exist (no null or undefined)
		expect(hashedPassword).toBeDefined();
		// ... Must not be equal to the source string
		expect(hashedPassword).not.toEqual(psw1);
	});
});
