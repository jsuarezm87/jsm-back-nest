import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    NODE_ENV: Joi.string().valid('dev', 'development', 'test', 'production').default('dev'),
    MONGODB: Joi.required(),
    MONGODB_DB_NAME: Joi.string().default('plantilla'),
    PORT: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number().default(10),
    SECRET_JWT: Joi.string().required(),
    CORS_ORIGINS: Joi.string().default('http://localhost:5173,http://localhost:3000')
})
