module.exports = {
	createServerError(cause, message) {
		const error = new Error(message);
		error.type = 'server';
		error.name = cause ? cause.name : 'ServerError';
		error.stack = cause ? cause.stack : 'Unknown';
		return error;
	},
	createClientError(message, statusCode, details) {
		const error = new Error(message);
		error.type = 'client';
		error.name = 'ClientError';
		error.details = details;
		error.statusCode = statusCode;
		return error;
	}
}
