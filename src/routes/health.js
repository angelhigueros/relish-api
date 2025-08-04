const healthController = require('../controllers/healthController')

const healthRoutes = async (fastify, _options) => {
  fastify.get('/', {
    schema: {
      description: 'Health check endpoint',
      tags: ['Health'],
      summary: 'Get API health status',
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: {
              type: 'object',
              properties: {
                status: { type: 'string' },
                timestamp: { type: 'string', format: 'date-time' },
                uptime: { type: 'number' },
                environment: { type: 'string' },
                version: { type: 'string' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, healthController.getHealth)
}

module.exports = healthRoutes
