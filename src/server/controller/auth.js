const logger = require('pino')();

const {
  receiveEmail,
  validateCode,
  useCode
} = require('../../services/signUp.js');

/**
 * Validate a email format using regex.
 * @param {string} email
 * @returns {boolean}.
 */
const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email.toLowerCase());
}

/**
 * Current controller.
 * @param {object} req request object.
 * @param {object} res response object.
 * @returns {Promise}.
 */
const signUpEmail = async (req, res, next) => {

  try {

    const {
      body
    } = req;

    //Validate request format.
    if (!(body && body.email))
      throw { statusCode: 400, message: "email required" };

    const { email } = body;
    logger.info({ action: "Signup by email", email });

    if (!(validateEmail(email)))
      throw { statusCode: 400, message: "bad email format" };

    //Record in dynamodb.
    await receiveEmail(email);

    res.status(200).json({
      email
    });

  } catch (error) {
    //Send to error middleware.
    next(error);
  };

};


/**
 * Verificate email controller
 * @param {object} req request object.
 * @param {object} res response object.
 * @returns {Promise}.
 */
const verifyEmail = async (req, res, next) => {

  try {

    //Validate request format.
    if (!(req && req.params && req.params.code))
      throw { statusCode: 400, message: "Invalid request" };

    const {
      code
    } = req.params;

    logger.info({ action: "Validate code", code });

    //Find the code.
    const isValid = await validateCode(code);

    if (!isValid)
      throw { statusCode: 400, message: 'Wrong code', code };

    //Update the code.
    await useCode(code);

    //Create the user in cognito by the email.
    await createEmailUser(code);

    res.status(200).json({
      code
    });

  } catch (error) {
    //Send to error middleware.
    next(error);
  };

};

module.exports = {
  signUpEmail,
  verifyEmail
};
