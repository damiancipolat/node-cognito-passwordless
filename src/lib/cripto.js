const crypto = require("crypto");

/**
 * Receive an string an encode using SHA256.
 * @param {string} text value to be encoded. 
 * @returns {string}
 */
const encodeStr = (text) => crypto.createHash("sha256").update(text).digest("hex");

module.exports = {
    encodeStr
};