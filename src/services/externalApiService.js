const axios = require('axios')

const BASE_URL = 'https://jsonplaceholder.typicode.com'


class ExternalApiService {
  /**
   * Get user by ID
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User data
   */
  async getUserById(userId) {
    try {
      const response = await axios.get(`${BASE_URL}/users/${userId}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch user ${userId}: ${error.message}`)
    }
  }

  /**
   * Get album by ID
   * @param {number} albumId - Album ID
   * @returns {Promise<Object>} Album data
   */
  async getAlbumById(albumId) {
    try {
      const response = await axios.get(`${BASE_URL}/albums/${albumId}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch album ${albumId}: ${error.message}`)
    }
  }

  /**
   * Get photo by ID
   * @param {number} photoId - Photo ID
   * @returns {Promise<Object>} Photo data
   */
  async getPhotoById(photoId) {
    try {
      const response = await axios.get(`${BASE_URL}/photos/${photoId}`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch photo ${photoId}: ${error.message}`)
    }
  }

  /**
   * Get all photos
   * @returns {Promise<Array>} All photos data
   */
  async getAllPhotos() {
    try {
      const response = await axios.get(`${BASE_URL}/photos`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch all photos: ${error.message}`)
    }
  }

  /**
   * Get all albums
   * @returns {Promise<Array>} All albums data
   */
  async getAllAlbums() {
    try {
      const response = await axios.get(`${BASE_URL}/albums`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch all albums: ${error.message}`)
    }
  }

  /**
   * Get all users
   * @returns {Promise<Array>} All users data
   */
  async getAllUsers() {
    try {
      const response = await axios.get(`${BASE_URL}/users`)
      return response.data
    } catch (error) {
      throw new Error(`Failed to fetch all users: ${error.message}`)
    }
  }

  /**
   * Get enriched photo data with album and user information
   * @param {number} photoId - Photo ID
   * @returns {Promise<Object>} Enriched photo data
   */
  async getEnrichedPhoto(photoId) {
    try {
      const photo = await this.getPhotoById(photoId)
      
      const album = await this.getAlbumById(photo.albumId)
      
      const user = await this.getUserById(album.userId)
      
      return {
        id: photo.id,
        title: photo.title,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        album: {
          id: album.id,
          title: album.title,
          user: user
        }
      }
    } catch (error) {
      throw new Error(`Failed to enrich photo ${photoId}: ${error.message}`)
    }
  }

  /**
   * Get filtered and enriched photos with pagination
   * @param {Object} filters - Filter criteria
   * @param {string} filters.title - Photo title contains
   * @param {string} filters.albumTitle - Album title contains
   * @param {string} filters.userEmail - User email equals
   * @param {number} filters.limit - Maximum number of items to return (default: 25)
   * @param {number} filters.offset - Starting offset into the collection (default: 0)
   * @returns {Promise<Object>} Filtered and enriched photos with pagination info
   */
  async getFilteredPhotos(filters = {}) {
    try {
      const [photos, albums, users] = await Promise.all([
        this.getAllPhotos(),
        this.getAllAlbums(),
        this.getAllUsers()
      ])

      const albumsMap = new Map(albums.map(album => [album.id, album]))
      const usersMap = new Map(users.map(user => [user.id, user]))

      const enrichedPhotos = photos
        .map(photo => {
          const album = albumsMap.get(photo.albumId)
          if (!album) return null
          
          const user = usersMap.get(album.userId)
          if (!user) return null

          return {
            id: photo.id,
            title: photo.title,
            url: photo.url,
            thumbnailUrl: photo.thumbnailUrl,
            album: {
              id: album.id,
              title: album.title,
              user: user
            }
          }
        })
        .filter(photo => photo !== null)
        .filter(photo => {
          if (filters.title && !photo.title.toLowerCase().includes(filters.title.toLowerCase())) {
            return false
          }

          if (filters.albumTitle && !photo.album.title.toLowerCase().includes(filters.albumTitle.toLowerCase())) {
            return false
          }

          if (filters.userEmail && photo.album.user.email !== filters.userEmail) {
            return false
          }

          return true
        })

      const limit = filters.limit || 25
      const offset = filters.offset || 0
      const totalCount = enrichedPhotos.length
      const paginatedPhotos = enrichedPhotos.slice(offset, offset + limit)

      return {
        photos: paginatedPhotos,
        pagination: {
          total: totalCount,
          limit: limit,
          offset: offset,
          hasNext: offset + limit < totalCount,
          hasPrevious: offset > 0
        }
      }
    } catch (error) {
      throw new Error(`Failed to get filtered photos: ${error.message}`)
    }
  }
}

module.exports = new ExternalApiService() 