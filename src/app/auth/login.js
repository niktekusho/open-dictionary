module.exports = async function (fastify) {
	const {userService, jwt} = fastify;
	if (userService === null || userService === undefined) {
		throw new Error('User Service must be initialized before the application starts.');
	}
	fastify.post('/login', async (req, res) => {
		const {username, password} = req.body;
		try {
			await userService.authenticate(username, password);
		} catch (error) {
			// Catch the authentication error
			fastify.log.error(error);
			return res.code(401).send(error);
		}
		const tokenData = {username, password};
		// reasonable default: expire the token in 7 days
		const tokenOpts = {
			expiresIn: '7d'
		};
		// async JWT token creation
		return new Promise((resolve, reject) => {
			jwt.sign(tokenData, null, tokenOpts, () => {
				console.log(arguments);
				resolve(true);
			});
		});
	});
};
