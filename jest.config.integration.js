const config = require('./jest.config');

/* Jest Config */
// Change the test pattern
config.testRegex = 'ispec.js$';
// Set 10 seconds of timeout (Travis being slow...)
config.setupTestFrameworkScriptFile = './jest.setup.js';

config.globalSetup = './scripts/integration-tests-setup.js';
config.globalTeardown = './scripts/integration-tests-teardown.js';

module.exports = config;
