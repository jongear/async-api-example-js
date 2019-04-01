const joi = require('joi');

const envVarsSchema = joi
  .object({
    PORT: joi.number().default(3000),
    NODE_ENV: joi.string().default('development')
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const serverSettings = {
  port: +envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  CONSTANTS: {
    ENVIRONMENT: {
      PRODUCTION: 'production',
      DEVELOPMENT: 'development'
    }
  }
};

module.exports = serverSettings;
