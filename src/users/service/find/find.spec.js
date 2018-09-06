const find = require('./find');

describe('User service -> \'Find Module\' test suite', () => {
	it('exported object should be a function', () => {
		expect(find).toMatchObject({
			findByEmail: expect.any(Function),
			findByUsername: expect.any(Function)
		});
	});
});
