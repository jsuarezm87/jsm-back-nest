export const  EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev' ,     
    mongodb: process.env.MONGODB,   
    port: process.env.PORT || 4000,
    defautlLimit: +process.env.DEFAULT_LIMIT || 7
})