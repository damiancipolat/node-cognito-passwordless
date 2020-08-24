const logger = require('pino')();

/**
 * Health controller.
 * @param {object} req request object.
 * @param {object} res response object.
 */
const health = (req,res)=>{ 
  
  logger.info({url: req.url, method: req.method, message:`Health request`});
  res.status(200).json({"health":"OK"});

}

module.exports = health