const Validation = require('../validation');

/**
 *
 * @param {*} emailMessage Must be defined
 * @param {*} property Property to check the existance for
 * @returns {Validation} Validation object
 */
function checkSingleProperty(emailMessage, property) {
	const propValue = emailMessage[property];
	let isValid = true;
	let message = null;
	if (propValue === null || propValue === undefined) {
		isValid = false;
		message = `Missing property: ${property}`;
	}
	return new Validation(isValid, message ? {message} : {});
}

module.exports = function (emailMessage) {
	// If the message is not defined, it is not valid
	if (emailMessage === null || emailMessage === undefined) {
		return new Validation(false, {message: 'Message object is NOT defined.'});
	}

	// From here emailMessage is defined, let's check for required properties
	const requiredProperties = ['from', 'to', 'subject', 'text', 'html'];
	requiredProperties.forEach(required => {
		// Use the function defined above to check the single property
		const validationResult = checkSingleProperty(emailMessage, required);
		// If the result of the validation is invalid, return immediately
		if (!validationResult.isValid) {
			return validationResult;
		}
	});

	// Guaranted valid email object
	return new Validation(true);
};
