require('dotenv').config()

const config = {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0'
  },
  api: {
    prefix: process.env.API_PREFIX || '/api/v1'
  },
  environment: process.env.NODE_ENV || 'development',
  swagger: {
    info: {
      title: 'Relish API',
      description: 'API REST with Fastify and Swagger',
      version: '1.0.0'
    },
    host: process.env.HOST || 'localhost',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json']
  }
}

module.exports = config 