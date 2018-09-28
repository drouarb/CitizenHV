/**
 * Created with <3 by drouar_b
 */

const express = require('express');
const HVController = require('../core/HVController');
const CityController = require('../core/CityController');
const router = express.Router();

//Hypervisor Routes
router.get('/vms', HVController.listVMs);
router.get('/vms/:vmname', HVController.statusVM);
router.get('/vms/:vmname/xml', HVController.xmlVM);
router.get('/vms/:vmname/start', HVController.startVM);
router.get('/vms/:vmname/stop', HVController.stopVM);

router.get('/cities', CityController.listCities);
router.get('/city/:city', CityController.cityInfo);
router.get('/city/:city/vms', CityController.listVms);
router.get('/city/:city/spawn', CityController.spawn);

router.all('*', (req, res) => {
    res.sendStatus(404);
});

module.exports = router;