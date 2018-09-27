module.exports = function (fastify, opts, next) {
	fastify.setNotFoundHandler((request, reply) => {
		const {username} = request.params;
		console.log(request);
		console.log(username);
		console.log(reply);
		reply.send(`User with username ${username} not found`);
	});
	next();
};
