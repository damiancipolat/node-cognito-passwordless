const {
  getLocation
} = require('../lib/ipdata.js');

/**
 * Location controller.
 */
const fetchLocation = async (ip)=> await getLocation(ip);

module.exports = {
  fetchLocation
};