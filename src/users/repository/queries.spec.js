const queries = require('./queries');

describe('User repository -> \'Available queries\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(queries).toEqual(expect.any(Function));
		});
		it('function invocation should return the available queries', () => {
			const availableQueries = queries();
			expect(availableQueries).toHaveProperty('equalsUsername');
			expect(availableQueries).toHaveProperty('equalsEmail');
			expect(availableQueries).toHaveProperty('createdToday');
		});
	});

	describe('Evaluating module functionality', () => {
		describe('Evaluating "equalsUsername"', () => {
			it ('should create an username object', () => {
				const availableQueries = queries();
				expect(availableQueries.equalsUsername('test')).toEqual({username: 'test'});
			});
		});
		describe('Evaluating "equalsEmail"', () => {
			it ('should create an email object', () => {
				const availableQueries = queries();
				expect(availableQueries.equalsEmail('test')).toEqual({email: 'test'});
			});
		});
		describe('Evaluating "createdToday"', () => {
			it ('should create an _id query object', () => {
				// Mocked mongodb dependency
				const mongodb = {
					ObjectID: {
						createFromTime: jest.fn(() => 'sometime')
					}
				};
				const availableQueries = queries(mongodb);
				expect(availableQueries.createdToday()).toEqual({_id: { $gte: 'sometime'}});
				expect(mongodb.ObjectID.createFromTime).toHaveBeenCalledTimes(1);
			});
		});
	});
});
