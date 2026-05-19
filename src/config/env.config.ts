export const  EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev' ,     
    mongodb: process.env.MONGODB,   
    port: +(process.env.PORT || 3005),
    defaultLimit: +(process.env.DEFAULT_LIMIT || 10),
    secretJwt: process.env.SECRET_JWT,
    corsOrigins: process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000'
})
