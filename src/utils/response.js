
/**
 * Creates a success response
 * @param {Object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {Object} Formatted response
 */
const success = (data = null, message = 'Success', statusCode = 200) => {
  return {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  }
}

/**
 * Creates an error response
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {Object} errors - Additional error details
 * @returns {Object} Formatted error response
 */
const error = (message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return {
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  }
}

module.exports = {
  success,
  error
} 