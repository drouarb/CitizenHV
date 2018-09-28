/**
 * Created with <3 by drouar_b
 */

const express = require('express');
const VMController = require('../core/VMController');
const router = express.Router();

//Routes for VM callback
router.get('/callback/config', VMController.getConfig);
router.get('/callback/front', VMController.getFrontConfig);
router.get('/callback/done', VMController.deploymentDone);

router.all('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;