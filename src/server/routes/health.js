const express = require('express');
const router  = express.Router();

//Get the routes.
const health   = require('../controller/health.js');
const notFound = require('../controller/not-found.js');

//Bind routes with controller.
router.get('/ready',health);
router.get('/live',health);
router.get('/',health);
router.get('*',notFound);

module.exports = router;