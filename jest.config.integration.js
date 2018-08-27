const config = require('./jest.config');

// Change the test pattern
config.testRegex = 'ispec.js$';

module.exports = config;
