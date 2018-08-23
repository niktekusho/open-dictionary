// TODO naive implementation, manage authorization grants
const {UserRole} = require('./user');

// ErrorHandler should take 2 args: the error and a message that can be returned
function createUserService({userRepository, errorHandler}) {
	// Get only the _id
	const minimalProjection = {
		_id: true
	};
	async function findByEmail(email, projection) {
		return userRepository.find({email}, projection);
	}

	async function findByUsername(username, projection) {
		return userRepository.find({username}, projection);
	}

	/**
	 * Find by username or email. Returns null if no user found with the specified params. Returns the email or the username of the user if found.
	 * @param {*} username Username to search for
	 * @param {*} email Email to search for
	 * @param {*} projection Which projection to use ("which data does MongoDB send back")
	 * @returns If user found its email or username (in this order) otherwise null (user does not exist)
	 */
	async function findByEmailOrUsername(username, email, projection) {
		let existingUser = await findByEmail(email, projection);
		if (existingUser !== null && existingUser !== undefined) {
			return email;
		}
		existingUser = await findByUsername(username, projection);
		if (existingUser !== null && existingUser !== undefined) {
			return username;
		}
		return null;
	}

	return {
		getUsers: async () => {
			let users;
			try {
				users = await userRepository.find();
			} catch (err) {
				return errorHandler(err, 'Users retrieval failed');
			}
			return users;
		},
		getUser: async ({username}) => {
			let user;
			try {
				user = await userRepository.find({username});
			} catch (err) {
				return errorHandler(err, 'User retrieval failed');
			}
			return user;
		},
		createUser: async ({
			username,
			fullname,
			email,
			passwordHash,
			nativeLanguage,
			roles = [UserRole.READER]
		}) => {
			let newUser;
			try {
				try {
					const existingUser = await findByEmailOrUsername(username, email, minimalProjection);
					switch (existingUser) {
						case email: return errorHandler(null, `User creation failed. Email ${email} already in the system.`);
						case username: return errorHandler(null, `User creation failed. Username ${username} already in the system.`);
						default:
							break;
					}
				} catch (err) {
					return errorHandler(err, 'Unknown error');
				}
				newUser = await userRepository.insert({
					username, fullname, email, passwordHash, nativeLanguage, roles
				});
			} catch (err) {
				return errorHandler(err, 'User creation failed');
			}
			return newUser;
		},
		updateUser: async (usernameToUpdate, {username, fullname, email, passwordHash, nativeLanguage, roles}) => {
			let updatedUser;
			try {
				const existingUser = await findByUsername(usernameToUpdate);
				if (existingUser === null || existingUser === undefined) {
					// TODO
					return errorHandler(null, `User update failed. User with username ${usernameToUpdate} not found in the system.`);
				}
				updatedUser = await userRepository.update(usernameToUpdate, {
					username, email, fullname, passwordHash, nativeLanguage, roles
				});
			} catch (err) {
				return errorHandler(err, 'User update failed');
			}
			return updatedUser;
		},
		deleteUser: async ({username}) => {
			let deleteResponse;
			try {
				const existingUser = await userRepository.find({username});
				if (existingUser === null || existingUser === undefined) {
					// TODO
					return errorHandler(null, `User delete failed. User with username ${username} not found in the system.`);
				}
				deleteResponse = await userRepository.delete({username});
			} catch (err) {
				return errorHandler(err, 'User delete failed');
			}
			return deleteResponse;
		}
	};
}

module.exports = createUserService;
