module.exports = {
	host: process.env.OD_USER_DB_HOST ? process.env.OD_USER_DB_HOST : 'localhost',
	port: process.env.OD_USER_DB_PORT ? process.env.OD_USER_DB_PORT : 27000,
	database: process.env.OD_USER_DB_NAME ? process.env.OD_USER_DB_NAME : 'users'
};
