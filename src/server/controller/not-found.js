const logger = require('pino')();

/**
 * Not found controller.
 * @param {object} req request object.
 * @param {object} res response object.
 */
const notFound = (req, res) => {
  logger.info({ url: req.url, method: req.method, message: `Not found` });
  res.status(404).json({ error: 'Route not found.' });
};

module.exports = notFound;
