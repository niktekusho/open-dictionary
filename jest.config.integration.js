const config = require('./jest.config');

// Change the test pattern
config.testRegex = 'ispec.js$';

// Set 10 seconds of timeout (Travis being slow...)
jest.setTimeout(10 * 1000);

module.exports = config;
