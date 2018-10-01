const fastify = require('fastify');

const usersSetupPlugin = require('./app/app-setup');
const usersAPIPlugin = require('./app/app-users');

const app = fastify({
	logger: true
});

app
	.register(usersSetupPlugin)
	.register(usersAPIPlugin, {prefix: '/users'});

app.ready(async err => {
	if (err) {
		console.error(`Could not boot server: ${err.message}`);
		console.debug(err.stack);
		console.info('Aborting startup...');
		process.kill(process.pid, 'SIGTERM');
		// eslint-disable-next-line unicorn/no-process-exit
		process.exit(1);
	}
	const port = 3000;
	app.listen(port,
		() => console.info(app.printRoutes())
	);
});
