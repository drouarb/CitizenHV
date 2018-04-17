const Promise = require('bluebird');
const helpers = require('libvirt').helpers;
const config = require('./config');
const hv = new require('libvirt').Hypervisor(config.hv_url);

hv.connect((err) => {
    if (err) {
        console.log("Can't connect to the HV");
        console.log(err);
        return;
    }

    console.log("Nice");

    hv.listActiveDomains((err, domains) => {

        console.log(domains);

        domains[0].shutdown((err) => {
            console.log(err);
        })
    })
});