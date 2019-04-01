const joi = require('joi');

const envVarsSchema = joi
  .object({
    DB_DATABASE: joi.string().required(),
    DB_USERNAME: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().default(3306)
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const dbSettings = {
  database: envVars.DB_DATABASE,
  username: envVars.DB_USERNAME,
  password: envVars.DB_PASSWORD,
  options: {
    host: envVars.DB_HOST,
    port: +envVars.DB_PORT,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
};

module.exports = dbSettings;
