// TODO naive implementation, manage authorization grants
const {UserRole} = require('./user');

// ErrorHandler should take 2 args: the error and a message that can be returned
function createUserService({userRepository, errorHandler}) {
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
		getUser: async ({id}) => {
			let user;
			try {
				user = await userRepository.find({id});
			} catch (err) {
				return errorHandler(err, 'User retrieval failed');
			}
			return user;
		},
		createUser: async ({
			name,
			email,
			passwordHash,
			nativeLanguage,
			roles = [UserRole.READER]
		}) => {
			let newUser;
			try {
				const existingUser = await userRepository.find({email});
				if (existingUser !== null && existingUser !== undefined) {
					// TODO
					return errorHandler(null, `User creation failed. Email ${email} already in the system.`);
				}
				newUser = await userRepository.insert({
					name, email, passwordHash, nativeLanguage, roles
				});
			} catch (err) {
				return errorHandler(err, 'User creation failed');
			}
			return newUser;
		},
		updateUser: async (id, {name, email, passwordHash, nativeLanguage, roles}) => {
			let updatedUser;
			try {
				const existingUser = await userRepository.find(id);
				if (existingUser === null || existingUser === undefined) {
					// TODO
					return errorHandler(null, `User update failed. User with id ${id} not found in the system.`);
				}
				updatedUser = await userRepository.update(id, {
					id, email, name, passwordHash, nativeLanguage, roles
				});
			} catch (err) {
				return errorHandler(err, 'User update failed');
			}
			return updatedUser;
		},
		deleteUser: async ({id}) => {
			let deleteResponse;
			try {
				const existingUser = await userRepository.find({id});
				if (existingUser === null || existingUser === undefined) {
					// TODO
					return errorHandler(null, `User delete failed. User with id ${id} not found in the system.`);
				}
				deleteResponse = await userRepository.delete({id});
			} catch (err) {
				return errorHandler(err, 'User delete failed');
			}
			return deleteResponse;
		}
	};
}

module.exports = createUserService;
