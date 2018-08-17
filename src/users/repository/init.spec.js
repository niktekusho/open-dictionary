const init = require('./init');

describe('User repository -> \'Init\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be an  object containing the connect function', () => {
			expect(init).toEqual(expect.any(Object));
			expect(init.connect).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
		const db = jest.fn(() => {
			return {
				collections: {}
			};
		});
		const mongodb = {
			Logger: {
				setLevel: jest.fn(),
				filter: jest.fn()
			},
			MongoClient: {
				connect: jest.fn(() => {
					return {
						db
					};
				})
			}
		};
		const url = 'mongodb://host:1234/db';

		it('should call MongoClient.connect function', async () => {
			await expect(init.connect(mongodb, url)).resolves.toEqual(db());
			expect(mongodb.MongoClient.connect).toHaveBeenCalledTimes(1);
			expect(mongodb.MongoClient.connect).toHaveBeenCalledWith('mongodb://host:1234/db', expect.anything());
		});
	});
});
