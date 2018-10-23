module.exports = async function (fastify) {
	const {errors, jwt, userService} = fastify;
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
		// Reasonable default: expire the token in 1 hour
		const tokenOpts = {
			expiresIn: '1h'
		};
		// Async JWT token creation
		return new Promise((resolve, reject) => {
			jwt.sign(tokenData, tokenOpts, (error, jwtToken) => {
				if (error) {
					const serverError = errors.createServerError(error, 'JWT signing failed');
					return reject(serverError);
				}
				resolve(jwtToken);
			});
		});
	});
};
