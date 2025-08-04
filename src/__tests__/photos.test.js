const { createServer } = require('../server')

// Mock axios to avoid real HTTP calls in tests
jest.mock('axios')
const axios = require('axios')

describe('Photos Endpoint', () => {
  let server

  beforeAll(async () => {
    server = await createServer()
  })

  afterAll(async () => {
    await server.close()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET /api/v1/photos/1 should return enriched photo data', async () => {
    // Mock the external API responses
    axios.get
      .mockResolvedValueOnce({
        data: {
          albumId: 1,
          id: 1,
          title: 'accusamus beatae ad facilis cum similique qui sunt',
          url: 'https://via.placeholder.com/600/92c952',
          thumbnailUrl: 'https://via.placeholder.com/150/92c952'
        }
      })
      .mockResolvedValueOnce({
        data: {
          userId: 1,
          id: 1,
          title: 'quidem molestiae enim'
        }
      })
      .mockResolvedValueOnce({
        data: {
          id: 1,
          name: 'Leanne Graham',
          username: 'Bret',
          email: 'Sincere@april.biz',
          address: {
            street: 'Kulas Light',
            suite: 'Apt. 556',
            city: 'Gwenborough',
            zipcode: '92998-3874',
            geo: {
              lat: '-37.3159',
              lng: '81.1496'
            }
          },
          phone: '1-770-736-8031 x56442',
          website: 'hildegard.org',
          company: {
            name: 'Romaguera-Crona',
            catchPhrase: 'Multi-layered client-server neural-net',
            bs: 'harness real-time e-markets'
          }
        }
      })

    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/photos/1'
    })

    expect(response.statusCode).toBe(200)

    const payload = JSON.parse(response.payload)
    expect(payload.success).toBe(true)
    expect(payload.message).toBe('Photo data retrieved successfully')
    expect(payload.data).toHaveProperty('id', 1)
    expect(payload.data).toHaveProperty('title')
    expect(payload.data).toHaveProperty('url')
    expect(payload.data).toHaveProperty('thumbnailUrl')
    expect(payload.data).toHaveProperty('album')
    expect(payload.data.album).toHaveProperty('id', 1)
    expect(payload.data.album).toHaveProperty('title')
    expect(payload.data.album).toHaveProperty('user')
    expect(payload.data.album.user).toHaveProperty('id', 1)
    expect(payload.data.album.user).toHaveProperty('name')
    expect(payload.data.album.user).toHaveProperty('address')
  })

  test('GET /api/v1/photos/invalid should return 400', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/photos/invalid'
    })

    expect(response.statusCode).toBe(400)

    const payload = JSON.parse(response.payload)
    expect(payload.success).toBe(false)
    expect(payload.message).toContain('Invalid photo ID')
  })

  test('GET /api/v1/photos/0 should return 400', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/photos/0'
    })

    expect(response.statusCode).toBe(400)

    const payload = JSON.parse(response.payload)
    expect(payload.success).toBe(false)
    expect(payload.message).toContain('Invalid photo ID')
  })

  test('GET /api/v1/photos/999 should return 404 when photo not found', async () => {
    // Mock axios to return 404
    axios.get.mockRejectedValueOnce({
      response: { status: 404 },
      message: 'Request failed with status code 404'
    })

    const response = await server.inject({
      method: 'GET',
      url: '/api/v1/photos/999'
    })

    expect(response.statusCode).toBe(404)

    const payload = JSON.parse(response.payload)
    expect(payload.success).toBe(false)
    expect(payload.message).toBe('Photo not found')
  })

  // Tests for filtered photos endpoint
  describe('Filtered Photos Endpoint', () => {
    beforeEach(() => {
      // Mock the external API responses for filtered photos
      axios.get
        .mockResolvedValueOnce({
          data: [
            {
              albumId: 1,
              id: 1,
              title: 'accusamus beatae ad facilis cum similique qui sunt',
              url: 'https://via.placeholder.com/600/92c952',
              thumbnailUrl: 'https://via.placeholder.com/150/92c952'
            },
            {
              albumId: 1,
              id: 2,
              title: 'repudiandae iusto',
              url: 'https://via.placeholder.com/600/771796',
              thumbnailUrl: 'https://via.placeholder.com/150/771796'
            }
          ]
        })
        .mockResolvedValueOnce({
          data: [
            {
              userId: 1,
              id: 1,
              title: 'quidem molestiae enim'
            }
          ]
        })
        .mockResolvedValueOnce({
          data: [
            {
              id: 1,
              name: 'Leanne Graham',
              username: 'Bret',
              email: 'Sincere@april.biz',
              address: {
                street: 'Kulas Light',
                suite: 'Apt. 556',
                city: 'Gwenborough',
                zipcode: '92998-3874',
                geo: {
                  lat: '-37.3159',
                  lng: '81.1496'
                }
              },
              phone: '1-770-736-8031 x56442',
              website: 'hildegard.org',
              company: {
                name: 'Romaguera-Crona',
                catchPhrase: 'Multi-layered client-server neural-net',
                bs: 'harness real-time e-markets'
              }
            }
          ]
        })
    })

    test('GET /api/v1/photos should return all photos when no filters', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos'
      })

      expect(response.statusCode).toBe(200)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(true)
      expect(payload.data).toHaveProperty('photos')
      expect(payload.data).toHaveProperty('pagination')
      expect(payload.data.photos).toBeInstanceOf(Array)
      expect(payload.data.photos.length).toBeGreaterThan(0)
      expect(payload.data.photos[0]).toHaveProperty('id')
      expect(payload.data.photos[0]).toHaveProperty('album')
      expect(payload.data.photos[0].album).toHaveProperty('user')
    })

    test('GET /api/v1/photos?title=repudiandae should filter by title', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?title=repudiandae'
      })

      expect(response.statusCode).toBe(200)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(true)
      expect(payload.message).toContain('Found')
      expect(payload.data).toHaveProperty('photos')
      expect(payload.data).toHaveProperty('pagination')

      // Check that all returned photos contain the filter term
      payload.data.photos.forEach(photo => {
        expect(photo.title.toLowerCase()).toContain('repudiandae')
      })
    })

    test('GET /api/v1/photos?album.title=quidem should filter by album title', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?album.title=quidem'
      })

      expect(response.statusCode).toBe(200)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(true)
      expect(payload.message).toContain('Found')
      expect(payload.data).toHaveProperty('photos')
      expect(payload.data).toHaveProperty('pagination')

      // Check that all returned photos have albums containing the filter term
      payload.data.photos.forEach(photo => {
        expect(photo.album.title.toLowerCase()).toContain('quidem')
      })
    })

    test('GET /api/v1/photos?album.user.email=Sincere@april.biz should filter by user email', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?album.user.email=Sincere@april.biz'
      })

      expect(response.statusCode).toBe(200)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(true)
      expect(payload.message).toContain('Found')
      expect(payload.data).toHaveProperty('photos')
      expect(payload.data).toHaveProperty('pagination')

      // Check that all returned photos have the specified user email
      payload.data.photos.forEach(photo => {
        expect(photo.album.user.email).toBe('Sincere@april.biz')
      })
    })

    test('GET /api/v1/photos?album.title=quidem&title=repudiandae should apply multiple filters', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?album.title=quidem&title=repudiandae'
      })

      expect(response.statusCode).toBe(200)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(true)
      expect(payload.message).toContain('Found')
      expect(payload.data).toHaveProperty('photos')
      expect(payload.data).toHaveProperty('pagination')

      // Check that all returned photos match both filters
      payload.data.photos.forEach(photo => {
        expect(photo.title.toLowerCase()).toContain('repudiandae')
        expect(photo.album.title.toLowerCase()).toContain('quidem')
      })
    })

    // Pagination tests
    test('GET /api/v1/photos?limit=5 should return limited results', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?limit=5'
      })

      expect(response.statusCode).toBe(200)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(true)
      expect(payload.data).toHaveProperty('photos')
      expect(payload.data).toHaveProperty('pagination')
      expect(payload.data.photos.length).toBeLessThanOrEqual(5)
      expect(payload.data.pagination.limit).toBe(5)
      expect(payload.data.pagination.offset).toBe(0)
    })

    test('GET /api/v1/photos?limit=10&offset=5 should return paginated results', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?limit=10&offset=5'
      })

      expect(response.statusCode).toBe(200)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(true)
      expect(payload.data).toHaveProperty('photos')
      expect(payload.data).toHaveProperty('pagination')
      expect(payload.data.photos.length).toBeLessThanOrEqual(10)
      expect(payload.data.pagination.limit).toBe(10)
      expect(payload.data.pagination.offset).toBe(5)
    })

    test('GET /api/v1/photos?album.title=quidem&limit=10&offset=50 should apply filters with pagination', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?album.title=quidem&limit=10&offset=50'
      })

      expect(response.statusCode).toBe(200)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(true)
      expect(payload.data).toHaveProperty('photos')
      expect(payload.data).toHaveProperty('pagination')
      expect(payload.data.photos.length).toBeLessThanOrEqual(10)
      expect(payload.data.pagination.limit).toBe(10)
      expect(payload.data.pagination.offset).toBe(50)

      // Check that all returned photos have albums containing the filter term
      payload.data.photos.forEach(photo => {
        expect(photo.album.title.toLowerCase()).toContain('quidem')
      })
    })

    test('GET /api/v1/photos?limit=invalid should return 400', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?limit=invalid'
      })

      expect(response.statusCode).toBe(400)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(false)
      expect(payload.message).toContain('Invalid limit parameter')
    })

    test('GET /api/v1/photos?offset=invalid should return 400', async () => {
      const response = await server.inject({
        method: 'GET',
        url: '/api/v1/photos?offset=invalid'
      })

      expect(response.statusCode).toBe(400)

      const payload = JSON.parse(response.payload)
      expect(payload.success).toBe(false)
      expect(payload.message).toContain('Invalid offset parameter')
    })
  })
})
