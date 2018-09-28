/**
 * Created with <3 by drouar_b
 */

const express = require('express');
const router = express.Router();
const proxyController = require('../core/ProxyController');

//Proxy
router.all('*', proxyController.proxyRequest);

module.exports = router;