var express = require('express');
var router = express.Router();

var stage = require('./stage');
var admin = require('./admin');

router.use('/stage', stage);
router.use('/admin', admin);


module.exports = router;