const {fakeUsers} = require('../users-test-utils');
const update = require('./update');

describe('User repository -> \'Update\' test suite', () => {
	describe('Evaluating exported module', () => {
		it('exported object should be a function', () => {
			expect(update).toEqual(expect.any(Function));
		});
	});

	describe('Evaluating module functionality', () => {
		const generateUserParam = (username, user) => {
			return {username, newUser: user};
		};
		describe('when function called without specifying which username to update', () => {
			it('should reject', async () => {
				await expect(update(generateUserParam(null, {}), null, null))
					.rejects
					.toEqual(expect.any(Error));
				await expect(update(generateUserParam(undefined, {}), null, null))
					.rejects
					.toEqual(expect.any(Error));
			});

			it('rejection error should give the appropriate reason', async () => {
				try {
					await update(generateUserParam(null, {}), null, null);
				} catch (error) {
					expect(error.message).toMatch(/^(Update failed).*(username)*.$/gi);
				}
			});
		});

		describe('when function called without specifying the new user entity', () => {
			it('should reject', async () => {
				await expect(update(generateUserParam('test', null), null, null))
					.rejects
					.toEqual(expect.any(Error));
				await expect(update(generateUserParam('test', undefined), null, null))
					.rejects
					.toEqual(expect.any(Error));
			});

			it('rejection error should give the appropriate reason', async () => {
				try {
					await update(generateUserParam('test', undefined), null, null);
				} catch (error) {
					expect(error.message).toMatch(/^(Update failed).*(entity)*.$/gi);
				}
			});
		});
		it('should call collection.findOneAndUpdate on the specified collection', async () => {
			const collection = {
				findOneAndUpdate: jest.fn(async (find, update) => update)
			};

			const logger = {
				debug: jest.fn()
			};

			const user = fakeUsers[0];
			const expectedUser = {
				$set: user
			};
			await expect(update(generateUserParam('test', user), logger, collection))
				.resolves
				.toEqual(expectedUser);
			expect(collection.findOneAndUpdate).toHaveBeenCalledTimes(1);
			expect(collection.findOneAndUpdate).toHaveBeenCalledWith({
				username: 'test'
			}, expectedUser);
		});
		it('if the username is not found it should reject', async () => {
			const collection = {
				findOneAndUpdate: jest.fn(Promise.reject(new Error('missing username')))
			};

			const logger = {
				debug: jest.fn()
			};

			const user = fakeUsers[0];
			await expect(update(generateUserParam('test', user), logger, collection))
				.rejects
				.toEqual(expect.any(Error));
			expect(collection.findOneAndUpdate).toHaveBeenCalledTimes(1);
		});
	});
});
