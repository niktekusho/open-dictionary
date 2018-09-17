const httpErrors = require('http-errors');

function userNotFoundHandler(req, res) {
	const {username} = req.params;
	res.send(`User with username ${username} not found`);
}

function getAllUsersRoute(app, userService) {
	app.get('/', async () => {
		try {
			return userService.getUsers();
		} catch (error) {
			app.log.error(error);
		}
	});
}

function getByUsernameRoute(app, userService) {
	app.get('/:username', async req => {
		const {username} = req.params;
		let serviceResult = null;
		try {
			serviceResult = await userService.findUserByUsername(username);
		} catch (error) {
			app.log.error(error);
			throw new httpErrors.InternalServerError();
		}
		if (serviceResult) {
			return serviceResult;
		}
		// User not found
		throw new httpErrors.NotFound();
	});
}

function createUserRoute(app, userService) {
	app.post('/', async () => {
		userService.test = 'TODO';
		return 'In the making!';
	});
}

function userRoutes(userService) {
	return async app => {
		app.setNotFoundHandler(userNotFoundHandler);
		getAllUsersRoute(app, userService);
		getByUsernameRoute(app, userService);
		createUserRoute(app, userService);
	};
}

module.exports = userRoutes;
