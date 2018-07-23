module.exports = {
	host: process.env.USER_DB_HOST ? process.env.USER_DB_HOST : 'localhost',
	port: process.env.USER_DB_PORT ? process.env.USER_DB_PORT : 27000,
	database: process.env.USER_DB_NAME ? process.env.USER_DB_NAME : 'users'
};
