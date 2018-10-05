const fastifyPlugin = require('fastify-plugin');

async function plugin(fastify, opts, next) {
	const {userService} = fastify;

	const adminUser = {
		username: 'admin',
		email: 'test@user.org',
		password: process.env.OD_ADMIN_PSW || 'admin',
		roles: ['ADMIN']
	};

	// first check if the admin user is already created
	let existingAdmin = null;
	try {
		existingAdmin = await userService.findUserByUsername(adminUser.username);
	} catch (error) {
		// No-op
	}

	// If the user is already here, skip the rest
	if (existingAdmin === null || existingAdmin === undefined) {
		try {
			await userService.createUser(adminUser);
		} catch (error) {
			fastify.log.error('Could not create demo admin user');
		}
	}

	next();
}

module.exports = fastifyPlugin(plugin);
