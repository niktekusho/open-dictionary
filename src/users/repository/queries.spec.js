const queries = require('./queries');

describe('User repository -> \'Available queries\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be an object', () => {
			expect(queries).toEqual(expect.any(Object));
		});
	});

	describe('Evaluating module functionality', () => {
	});
});
