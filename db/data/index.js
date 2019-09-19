const ENV = process.env.NODE_ENV || 'development';
const testData = require('../data/test-data');
const devData = require('../data/development-data');

const data = {
  development: devData,
  test: testData,
  production: devData
};

module.exports = data[ENV];