const express = require('express');
const router = express.Router();

//Get the routes.
const {
  signUpEmail,
  verifyEmail
} = require('../controller/auth.js');

const health = require('../controller/health.js');
const notFound = require('../controller/not-found.js');

//Bind routes with controller.
router.post('/email', signUpEmail);
router.get('/verify/:code', verifyEmail);
router.get('/health', health);
router.get('*', notFound);

module.exports = router;