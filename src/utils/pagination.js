/**
 * Pagination utility functions
 */

/**
 * Calculate pagination parameters
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Pagination metadata
 */
const getPaginationParams = (page, limit, total) => {
  const currentPage = Math.max(1, parseInt(page) || 1);
  const pageSize = Math.max(1, Math.min(100, parseInt(limit) || 10)); // Max 100 items per page
  const totalPages = Math.ceil(total / pageSize);
  const skip = (currentPage - 1) * pageSize;

  return {
    currentPage,
    pageSize,
    totalPages,
    skip,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    total
  };
};

/**
 * Create pagination response
 * @param {Array} data - The data for current page
 * @param {Object} pagination - Pagination metadata
 * @returns {Object} Formatted response with pagination
 */
const createPaginationResponse = (data, pagination) => {
  return {
    success: true,
    data,
    pagination: {
      page: pagination.currentPage,
      limit: pagination.pageSize,
      total: pagination.total,
      pages: pagination.totalPages,
      hasNext: pagination.hasNext,
      hasPrev: pagination.hasPrev
    },
    count: data.length
  };
};

/**
 * Parse and validate pagination query parameters
 * @param {Object} query - Request query object
 * @returns {Object} Parsed pagination parameters
 */
const parsePaginationQuery = (query) => {
  const { page = '1', limit = '10', sort = '-createdAt' } = query;

  return {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort
  };
};

module.exports = {
  getPaginationParams,
  createPaginationResponse,
  parsePaginationQuery
};
