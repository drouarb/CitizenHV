/**
 * Created with <3 by drouar_b
 */

const cors = require('cors');
const vhost = require('vhost');
const express = require('express');
const IPFilter = require('./utils/IPFilter');
const hvRoutes = require('./routes/hvRoutes');
const vmRoutes = require('./routes/vmRoutes');
const proxyRoutes = require('./routes/proxyRoutes');
const config = require('./config');

let app = express();

let hvapp = express();
hvapp.use('/', hvRoutes);
app.use(vhost(config.hv_domain, hvapp));

let vmapp = express();
vmapp.use('/', vmRoutes);
app.use(IPFilter.filter(config.bridge_ip, vmapp));

let proxyapp = express();
proxyapp.use(cors());
proxyapp.use('/', proxyRoutes);
app.use(proxyapp);

module.exports = app;