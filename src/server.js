const fastify = require('fastify')
const config = require('./config')
const registerRoutes = require('./routes')
const swaggerConfig = require('./plugins/swagger')

const createServer = async () => {
  const server = fastify({
    logger: config.environment === 'development' ? {
      level: 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname'
        }
      }
    } : {
      level: 'error'
    }
  })

  await server.register(require('@fastify/cors'), {
    origin: true,
    credentials: true
  })

  await server.register(require('@fastify/helmet'))

  await server.register(require('@fastify/rate-limit'), {
    max: 100,
    timeWindow: '1 minute'
  })

  await server.register(require('@fastify/swagger'), swaggerConfig)
  await server.register(require('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next()
      },
      preHandler: function (request, reply, next) {
        next()
      }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header
  })

  await server.register(registerRoutes, { prefix: config.api.prefix })

  server.get('/', async (request, reply) => {
    return {
      message: 'Welcome to Relish API',
      version: '1.0.0',
      documentation: `${request.protocol}://${request.hostname}/documentation`
    }
  })

  server.setErrorHandler((error, request, reply) => {
    server.log.error(error)
    
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal Server Error'
    
    reply.status(statusCode).send({
      success: false,
      message,
      timestamp: new Date().toISOString()
    })
  })

  return server
}

const start = async () => {
  try {
    const server = await createServer()
    
    await server.listen({
      port: config.server.port,
      host: config.server.host
    })

    console.log(`🚀 Server running on http://${config.server.host}:${config.server.port}`)
    console.log(`📚 Documentation available at http://${config.server.host}:${config.server.port}/documentation`)
    console.log(`🔍 Health check at http://${config.server.host}:${config.server.port}${config.api.prefix}/health`)
  } catch (err) {
    console.error('Error starting server:', err)
    process.exit(1)
  }
}

if (require.main === module) {
  start()
}

module.exports = { createServer, start } 