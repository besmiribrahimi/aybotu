// Main database export file
const { connectDB, disconnectDB } = require('./connection');
const models = require('./models');
const services = require('./services');

module.exports = {
  connectDB,
  disconnectDB,
  models,
  services,
  // Re-export commonly used services for convenience
  ...services
};
