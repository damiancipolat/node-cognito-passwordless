const config = require('config');

const {
  updateQuery,
  addElement,
  getById
} = require('../lib/dynamoLib.js');

const {
  encodeStr
} = require('../lib/cripto.js');

const {
  computePwd,
  newUser
} = require('../lib/user.js');

const {
  signUp
} = require('../lib/cognito.js');

const {
  arn,
  table
} = config.get('db');

/**
 * Create in cognito the user by his email-
 * @param {string} code validation code for email.
 * @returns {Promise}.
 */
const createEmailUser = async (code) => {

  //Get the email.
  const register = await getById('emails', 'email_id', code);

  if (!(register && register.Items && register.Items.length > 0))
    throw { message: 'Code not found' };

  //Get the data.
  const { email } = register.Items[0];

  //Create a cripted user.
  const user = newUser(email);

  //Create the user in cognito.
  return await signUp(user.userName, computePwd(user) + 'DC!', email);

}

module.exports = {
  createEmailUser
};