/**
 * Created by drouar_b on 27/04/2017.
 */

const express = require('express');
const bodyParser = require('body-parser');
const HVUtils = require("../utils/HVUtils");
const router = express.Router();

router.get('/vms/lists', async (req, res) => {
    let hv = await HVUtils.getHV();

    let domains = await hv.getAllDomains();

    res.send(JSON.stringify(domains))
});

router.get('/vms/start', async (req, res) => {
    let hv = await HVUtils.getHV();

    let domains = await hv.getAllDomains();

    if (domains.length === 0)
        res.send("No VMs");
    else {
        domains[0].start((err) => {
            if (err) {
                res.send("Failed");
                console.log(err);
            } else {
                res.send("Success")
            }
        })
    }
});

router.get('/vms/stop', async (req, res) => {
    let hv = await HVUtils.getHV();

    let domains = await hv.getAllDomains();

    if (domains.length === 0)
        res.send("No VMs");
    else {
        domains[0].shutdown((err) => {
            if (err) {
                res.send("Failed");
                console.log(err);
            } else {
                res.send("Success")
            }
        })
    }
});

module.exports = router;