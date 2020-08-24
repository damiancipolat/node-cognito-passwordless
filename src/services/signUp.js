const config = require('config');

const {
  updateQuery,
  addElement,
  getById
} = require('../lib/dynamoLib.js');

const {
  sendEmail
} = require('../lib/mailer.js');

const {
  encodeStr
} = require('../lib/cripto');

const {
  arn,
  table
} = config.get('db');

/**
 * Fetch the current city and wather conditions.
 * @param {boolean} city return city flag. 
 * @returns {Promise}.
 */
const receiveEmail = async (email) => {

  const timestamp = new Date().getTime();
  const token = encodeStr(`${email}${timestamp}`);

  //Create the record.
  const emailRegistration = {
    email_id: token,
    email,
    expire: '2019-01-01',
    validate: false
  };

  //Record the email.
  const dbResult = await addElement('emails', emailRegistration);

  //Make the content.
  const url = `http://127.0.0.1:8080/auth/verify/${token}`;
  const content = `<html><body><div><b>Verify your email:${email}</b></div><br><br><div>Click this link <a href="${url}">Verify</a></div></body></html>`;

  //Send the email.
  return await sendEmail(email, 'Email validation', content);

};

/**
 * Detect if the code is correct.
 * @param {string} code.
 * @returns {Promise}.
 */
const validateCode = async (code) => {

  //Find in dynamo db using the client Id.
  const result = await getById('emails', 'email_id', code);

  //Parse the result.
  if (!(result && result.Items && result.Items.length > 0))
    throw { message: 'Invalid code', statusCode: 400, code };

  //Get the element.
  const element = result.Items[0];

  return (!element.validate);

}

/**
 * Set the code to used.
 * @param {string} code.
 * @returns {Promise}.
 */
const useCode = async (code) => {

  //Make update params.
  const query = {
    TableName: 'emails',
    Key: {
      email_id: code
    },
    UpdateExpression: "set #tmpField = :tmpValue",
    ExpressionAttributeNames: {
      "#tmpField": 'validate',
    },
    ExpressionAttributeValues: {
      ":tmpValue": true
    },
  }

  return await updateQuery(query);

}

module.exports = {
  useCode,
  receiveEmail,
  validateCode
};

/*
  //Detect if the email is duplicated.
  const emails = (email) ? await scanItems(table, { "email": { S: email } }) : {};
  const badEmail = (emails && email.Items && email.Items.length > 0) ? true : false

  //Detect if the client exists by his id.
  const client = await getClientById(client_id);
  const badClient = (client && client.data) ? true : false;

  return badEmail || badClient;
*/