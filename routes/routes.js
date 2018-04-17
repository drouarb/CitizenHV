/**
 * Created by drouar_b on 27/04/2017.
 */

const express = require('express');
const bodyParser = require('body-parser');
const HVUtils = require("../utils/HVUtils");
const router = express.Router();

router.get('/vms/lists', async (req, res) => {
    let hv = await HVUtils.getHV();

    let infos = await hv.getNodeInfoAsync();

    res.send(JSON.stringify(infos))
});

module.exports = router;