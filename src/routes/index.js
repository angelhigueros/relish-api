const healthRoutes = require('./health')
const photoRoutes = require('./photos')

/**
 * Register all routes
 * @param {Object} fastify - Fastify instance
 */
const registerRoutes = async (fastify) => {
  await fastify.register(healthRoutes, { prefix: '/health' })

  await fastify.register(photoRoutes, { prefix: '/photos' })
}

module.exports = registerRoutes
