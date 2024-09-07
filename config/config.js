const dotenv = require('dotenv');

dotenv.config();

// module.exports = {
//   development: {
//     use_env_variable: 'DATABASE_DEV_URL',
//   },
//   test: {
//     use_env_variable: 'DATABASE_TEST_URL',
//   },
//   production: {
//     use_env_variable: 'DATABASE_URL',
//   },
// };


module.exports = {
  development: {
    username: 'postgres',
    password: 'admin123',  // Ensure this is a string
    database: 'izigo',
    host: '127.0.0.1',
    dialect: 'postgres',
  },
};