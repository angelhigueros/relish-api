const { success } = require('../utils/response')


const healthController = {
  /**
   * Get health status
   * @param {Object} request - Fastify request object
   * @param {Object} reply - Fastify reply object
   */
  getHealth: async (request, reply) => {
    const healthData = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    }

    return reply.send(success(healthData, 'API is healthy'))
  }
}

module.exports = healthController 