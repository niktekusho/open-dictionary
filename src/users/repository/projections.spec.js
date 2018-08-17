const projections = require('./projections');

describe('User repository -> \'Available projections\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(projections).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
		it('calling exported function should return projections', () => {
			const mockToProjection = {
				toProjection: jest.fn(i => i)
			};
			expect(projections(mockToProjection)).toEqual(expect.any(Object));
			expect(projections(mockToProjection).minimal).toBeDefined();
		});
	});
});
