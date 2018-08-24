const config = require('./jest.config');

// Change the test pattern
config.testRegex = 'ispec.js$';

// Include some custom behaviour through env vars
process.env.CONTAINER_DEFAULT_WAIT = 1;

module.exports = config;
