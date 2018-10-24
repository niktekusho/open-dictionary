// Defaults are ok
module.exports = {
	verbose: true,
	// Reporters (based on the environment)
	coverageReporters: process.env.CI ? ['json', 'lcov'] : ['text'],
	// Output for coverage reports
	coverageDirectory: 'coverage'
};
