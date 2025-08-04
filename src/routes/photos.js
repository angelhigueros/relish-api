const photoController = require('../controllers/photoController')

/**
 * Photo routes
 */
const photoRoutes = async (fastify, options) => {
  // Get filtered photos
  fastify.get('/', {
    schema: {
      description: 'Get filtered and enriched photos',
      tags: ['Photos'],
      summary: 'Get photos with filters',
      querystring: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Filter by photo title (contains)'
          },
          'album.title': {
            type: 'string',
            description: 'Filter by album title (contains)'
          },
          'album.user.email': {
            type: 'string',
            description: 'Filter by user email (equals)'
          },
          limit: {
            type: 'string',
            description: 'Maximum number of items to return (default: 25)',
            pattern: '^[1-9]\\d*$'
          },
          offset: {
            type: 'string',
            description: 'Starting offset into the collection (default: 0)',
            pattern: '^\\d+$'
          }
        }
      },
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
                photos: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'number' },
                      title: { type: 'string' },
                      url: { type: 'string' },
                      thumbnailUrl: { type: 'string' },
                      album: {
                        type: 'object',
                        properties: {
                          id: { type: 'number' },
                          title: { type: 'string' },
                          user: {
                            type: 'object',
                            properties: {
                              id: { type: 'number' },
                              name: { type: 'string' },
                              username: { type: 'string' },
                              email: { type: 'string' },
                              address: {
                                type: 'object',
                                properties: {
                                  street: { type: 'string' },
                                  suite: { type: 'string' },
                                  city: { type: 'string' },
                                  zipcode: { type: 'string' },
                                  geo: {
                                    type: 'object',
                                    properties: {
                                      lat: { type: 'string' },
                                      lng: { type: 'string' }
                                    }
                                  }
                                }
                              },
                              phone: { type: 'string' },
                              website: { type: 'string' },
                              company: {
                                type: 'object',
                                properties: {
                                  name: { type: 'string' },
                                  catchPhrase: { type: 'string' },
                                  bs: { type: 'string' }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    total: { type: 'number', description: 'Total number of items' },
                    limit: { type: 'number', description: 'Number of items per page' },
                    offset: { type: 'number', description: 'Starting offset' },
                    hasNext: { type: 'boolean', description: 'Whether there are more items' },
                    hasPrevious: { type: 'boolean', description: 'Whether there are previous items' }
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, photoController.getFilteredPhotos)

  fastify.get('/:id', {
    schema: {
      description: 'Get enriched photo with album and user information',
      tags: ['Photos'],
      summary: 'Get photo with enriched data',
      params: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Photo ID',
            pattern: '^[1-9]\\d*$'
          }
        },
        required: ['id']
      },
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
                id: { type: 'number' },
                title: { type: 'string' },
                url: { type: 'string' },
                thumbnailUrl: { type: 'string' },
                album: {
                  type: 'object',
                  properties: {
                    id: { type: 'number' },
                    title: { type: 'string' },
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'number' },
                        name: { type: 'string' },
                        username: { type: 'string' },
                        email: { type: 'string' },
                        address: {
                          type: 'object',
                          properties: {
                            street: { type: 'string' },
                            suite: { type: 'string' },
                            city: { type: 'string' },
                            zipcode: { type: 'string' },
                            geo: {
                              type: 'object',
                              properties: {
                                lat: { type: 'string' },
                                lng: { type: 'string' }
                              }
                            }
                          }
                        },
                        phone: { type: 'string' },
                        website: { type: 'string' },
                        company: {
                          type: 'object',
                          properties: {
                            name: { type: 'string' },
                            catchPhrase: { type: 'string' },
                            bs: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        400: {
          description: 'Bad request - Invalid photo ID',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        404: {
          description: 'Photo not found',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        500: {
          description: 'Internal server error',
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  }, photoController.getEnrichedPhoto)
}

module.exports = photoRoutes 