const config = require('../config')


const swaggerConfig = {
  swagger: {
    info: {
      title: config.swagger.info.title,
      description: config.swagger.info.description,
      version: config.swagger.info.version
    },
    host: config.swagger.host,
    schemes: config.swagger.schemes,
    consumes: config.swagger.consumes,
    produces: config.swagger.produces,
    tags: [
      { name: 'Health', description: 'Health check endpoints' },
      { name: 'Photos', description: 'Photo management endpoints' }
    ],
    definitions: {
      Error: {
        type: 'object',
        required: ['success', 'message', 'timestamp'],
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          errors: { type: 'object' },
          timestamp: { type: 'string', format: 'date-time' }
        }
      }
    }
  }
}

module.exports = swaggerConfig 