const { success, error } = require('../utils/response')
const externalApiService = require('../services/externalApiService')

const photoController = {
  /**
   * Get enriched photo with album and user information
   * @param {Object} request - Fastify request object
   * @param {Object} reply - Fastify reply object
   */
  getEnrichedPhoto: async (request, reply) => {
    try {
      const { id } = request.params
      const photoId = parseInt(id)

      if (isNaN(photoId) || photoId <= 0) {
        return reply.status(400).send(error('Invalid photo ID. Must be a positive number.', 400))
      }

      const enrichedPhoto = await externalApiService.getEnrichedPhoto(photoId)

      return reply.send(success(enrichedPhoto, 'Photo data retrieved successfully'))
    } catch (err) {
      if (err.message.includes('404')) {
        return reply.status(404).send(error('Photo not found', 404))
      }

      request.log.error(err)

      return reply.status(500).send(error('Failed to retrieve photo data', 500))
    }
  },

  /**
   * Get filtered and enriched photos with pagination
   * @param {Object} request - Fastify request object
   * @param {Object} reply - Fastify reply object
   */
  getFilteredPhotos: async (request, reply) => {
    try {
      const {
        title,
        'album.title': albumTitle,
        'album.user.email': userEmail,
        limit,
        offset
      } = request.query

      const filters = {}
      if (title) filters.title = title
      if (albumTitle) filters.albumTitle = albumTitle
      if (userEmail) filters.userEmail = userEmail

      if (limit !== undefined) {
        const limitNum = parseInt(limit)
        if (isNaN(limitNum) || limitNum <= 0) {
          return reply.status(400).send(error('Invalid limit parameter. Must be a positive number.', 400))
        }
        filters.limit = limitNum
      }

      if (offset !== undefined) {
        const offsetNum = parseInt(offset)
        if (isNaN(offsetNum) || offsetNum < 0) {
          return reply.status(400).send(error('Invalid offset parameter. Must be a non-negative number.', 400))
        }
        filters.offset = offsetNum
      }

      const result = await externalApiService.getFilteredPhotos(filters)

      const message = Object.keys(filters).length > 0
        ? `Found ${result.pagination.total} photos matching the specified filters`
        : `Retrieved ${result.pagination.total} photos`

      return reply.send(success({
        photos: result.photos,
        pagination: result.pagination
      }, message))
    } catch (err) {
      request.log.error(err)

      return reply.status(500).send(error('Failed to retrieve filtered photos', 500))
    }
  }
}

module.exports = photoController
