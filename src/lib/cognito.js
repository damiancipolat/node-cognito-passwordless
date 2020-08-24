//Load to make a fetch-api polyfill for nodejs.
const polyfill = require('cross-fetch/polyfill');

const {
  CognitoUser,
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoRefreshToken
} = require("amazon-cognito-identity-js");

const {
  poolData
} = require("../constants.js");

//Create a user pool instance with the poll in constants.
const UserPool = new CognitoUserPool(poolData);

/**
 * This function create an account into cognito, match standard attributes required with client.
 * @param {string} user
 * @param {string} password min. 6 chars.
 * @param {string} email    email format.
 * @returns {Promise} Cognito User object.
 */
const signUp = (user, password, email) => {

  return new Promise((resolve, reject) => {

    //This array match with Pool/Attributes/standard/required.
    const atttributeList = [
      new CognitoUserAttribute({
        Name: 'email',
        Value: email,
      })
    ];

    //Register the user.
    UserPool.signUp(user, password, atttributeList, null, (error, data) => (error) ? reject(error) : resolve(data));

  });

};

/**
 * Make the Sign in a current user with cognito auth.
 * @param {string} username
 * @param {string} password min. 6 chars.
 * @returns {Promise} 
 */
const signIn = (username, password) => {

  return new Promise((resolve, reject) => {

    //Create user representation.
    const user = new CognitoUser({
      Username: username,
      Pool: UserPool
    });

    //Create the auth with user + pwd.
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password
    });

    //Authenticate, handle callbacks
    user.authenticateUser(authDetails, {
      onSuccess: data => resolve(data),
      onFailure: err => reject(err),
      newPasswordRequired: data => resolve(data)
    });

  });

};

/**
 * Validate the user with the code provided from aws.
 * @param {string} username
 * @param {string} code.
 * @returns {Promise}
 */
const verifyCode = (username, code) => {

  return new Promise((resolve, reject) => {

    const userData = {
      Username: username,
      Pool: UserPool
    };

    //Create cognito user.
    const cognitoUser = new CognitoUser(userData);

    //Confirm the registration.
    cognitoUser.confirmRegistration(code, true, (error, result) => (error) ? reject(error) : resolve(result));

  });

}

/**
 * Resend validation code
 * @param {string} username
 * @returns {Promise}
 */
const resendCode = (username) => {

  return new Promise((resolve, reject) => {

    const userData = {
      Username: username,
      Pool: UserPool
    };

    //Create cognito user.
    const cognitoUser = new CognitoUser(userData);

    //Resend the link to a custom user.
    cognitoUser.resendConfirmationCode((error, result) => (error) ? reject(erro) : resolve(result));

  });

}

/**
 * Refresh the acces token
 * @param {string} username
 * @param {string} token jwt
 * @returns {Promise}
 */
const refreshToken = (username, token) => {

  return new Promise((resolve, reject) => {

    //Create token cognito
    const RefreshToken = new CognitoRefreshToken({
      RefreshToken: token
    });

    const userData = {
      Username: username,
      Pool: UserPool
    };

    //Create user poll
    const cognitoUser = new CognitoUser(userData);

    //Use the refres token with cognito to extend duration time.
    cognitoUser.refreshSession(RefreshToken, (error, session) => (error) ? reject(error) : resolve(session));

  });

}

module.exports = {
  signUp,
  signIn,
  verifyCode,
  resendCode,
  refreshToken
};