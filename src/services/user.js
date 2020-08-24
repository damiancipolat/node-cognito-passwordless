const config = require('config');

const {
  updateQuery,
  addElement,
  getById
} = require('../lib/dynamoLib.js');

const {
  encodeStr
} = require('../lib/cripto');

const {
  arn,
  table
} = config.get('db');

const createEmailUser = async (code) => {

  //Get the email.
  const register = await getById('emails', code);

  console.log('qqqq', register);

}

module.exports = {
  createEmailUser
};