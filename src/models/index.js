const Sequelize = require('sequelize');
const { dbSettings, serverSettings } = require('../config');
const Todo = require('./todo');

const showLogs =
  serverSettings.nodeEnv === serverSettings.CONSTANTS.ENVIRONMENT.DEVELOPMENT;

const options = {
  ...dbSettings.options,
  logging: showLogs
};

const sequelize = new Sequelize(
  dbSettings.database,
  dbSettings.username,
  dbSettings.password,
  options
);

const models = {
  Todo: Todo.init(sequelize)
};

// Load model associations
Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

models.sequelize = sequelize;

module.exports = models;
