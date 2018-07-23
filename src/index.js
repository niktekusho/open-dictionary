const mongodb = require('mongodb');

const userRepositoryFactory = require('./users/user.repository');

const userConfig = require('./config/user');

// TODO fix async-ness
const userRepository = userRepositoryFactory(mongodb, userConfig, console);

console.log(userRepository);
