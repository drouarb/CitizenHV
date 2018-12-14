/**
 * Created with <3 by drouar_b
 */

const Promise = require('bluebird');
const libvirt = require('libvirt');
const config = require('../config');

let hv = undefined;

class HVUtils {
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
                hv = hv_tmp;
                return hv
            })
            .catch((err) => {
                console.log("Can't connect")
            });
    }

    static async listAllDomains() {
        let hv = await HVUtils.getHV();

        return Promise.all([
            hv.listDefinedDomainsAsync(),
            hv.listActiveDomainsAsync()
                .then((ids) => {
                    return Promise.all(ids)
                        .map((id) => {
                            return hv.lookupDomainByIdAsync(id)
                        })
                        .map((domain) => {
                            return domain.getNameAsync()
                        })
                })
        ]).spread((defined, active) => {
            return defined.concat(active)
        });
    }

    static async getDomainFromName(name) {
        let hv = await HVUtils.getHV();

        return hv.lookupDomainByNameAsync(name)
    }
}

module.exports = HVUtils;