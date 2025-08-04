const { createServer } = require('../server')

describe('Health Endpoint', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(async () => {
    await server.close()
  })

  test('GET /api/v1/health should return 200 and health data', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/health'
    })

    expect(response.statusCode).toBe(200)
    
    const payload = JSON.parse(response.payload)
    expect(payload.success).toBe(true)
    expect(payload.message).toBe('API is healthy')
    expect(payload.data).toHaveProperty('status', 'OK')
    expect(payload.data).toHaveProperty('timestamp')
    expect(payload.data).toHaveProperty('uptime')
    expect(payload.data).toHaveProperty('environment')
    expect(payload.data).toHaveProperty('version')
  })

  test('GET / should return welcome message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/'
    })

    expect(response.statusCode).toBe(200)
    
    const payload = JSON.parse(response.payload)
    expect(payload.message).toBe('Welcome to Relish API')
    expect(payload.version).toBe('1.0.0')
    expect(payload.documentation).toContain('/documentation')
  })
}) 