import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    MONGODB: Joi.required(),
    PORT: Joi.number().default(3005),
    DEFAULT_LIMIT: Joi.number().default(10),
    SECRET_JWT: Joi.string().required(),
    CORS_ORIGINS: Joi.string().default('http://localhost:5173,http://localhost:3000')
})
