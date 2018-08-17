const queries = require('./queries');

describe('User repository -> \'Available queries\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(queries).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
	});
});
