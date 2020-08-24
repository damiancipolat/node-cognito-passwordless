const {
  encodeStr
} = require('../lib/cripto.js');

/**
 * Calculate a random int.
 * @param {int} min value.
 * @param {int} max value.
 * @returns {int}
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;


/**
 * Receive an string an encode using SHA256.
 * @param {string} text value to be encoded.
 * @returns {string}
 */
const computePwd = ({ seed, userName, email }) => encodeStr(`${seed.toString()}${userName}${email}`);

module.exports = {
  randomInt,
  encodeStr,
  computePwd
};