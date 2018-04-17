const Promise = require('bluebird');
const libvirt = require('libvirt');
const config = require('../config');

let hv = undefined;

class HVManager {
    static async getHV() {
        if (typeof hv !== "undefined") {
            return hv;
        }

        let hv_tmp = new libvirt.Hypervisor(config.hv_url);

        return new Promise((resolve, reject) => {
            hv_tmp.connect((err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            })
        })
            .then(() => {
                Promise.promisifyAll(hv_tmp);
                hv = hv_tmp;
                return hv
            })
            .catch((err) => {
                console.log("Can't connect")
            });
    }
}

module.exports = HVManager;