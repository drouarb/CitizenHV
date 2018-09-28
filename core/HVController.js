/**
 * Created with <3 by drouar_b
 */

const Promise = require('bluebird');
const HVUtils = require("../utils/HVUtils");
const sql = require('../sql');

class HV {
    static async listVMs(req, res) {
        res.send(JSON.stringify(await HVUtils.listAllDomains()));
    }

    static async findVM(req, res, callback) {
        HVUtils.getDomainFromName(req.params.vmname).then((domain) => {
            callback(domain)
        }).catch((err) => {
            res.status(404).send(JSON.stringify(err))
        });
    }

    static async statusVM(req, res) {
        HV.findVM(req, res, (domain) => {
            Promise.props({
                name: domain.getNameAsync(),
                uuid: domain.getUUIDAsync(),
                infos: domain.getInfoAsync()
            }).then((promises) => {
                res.send(JSON.stringify(promises));
            })
        });
    }

    static async xmlVM(req, res) {
        HV.findVM(req, res, async (domain) => {
            res.set('Content-Type', 'text/xml').send(await domain.toXmlAsync())
        })
    }

    static async startVM(req, res) {
        HV.findVM(req, res, async (domain) => {
            domain.startAsync()
                .then(() => {
                    res.send("Success !")
                })
                .catch(() => {
                    res.status(500).send("Fail !")
                })
        })
    }

    static async stopVM(req, res) {
        HV.findVM(req, res, async (domain) => {
            domain.shutdownAsync()
                .then(() => {
                    let uuidIndexOf = req.params.vmname.indexOf('-', req.params.vmname.indexOf('-') + 1);
                    if (uuidIndexOf === -1)
                        return "OK";

                    let vmUUID = req.params.vmname.substr(uuidIndexOf + 1);
                    console.log(vmUUID);
                    return sql.vms.destroy({
                        where: {
                            uuid: vmUUID
                        }
                    })
                })
                .then(() => {
                    res.send("Success !")
                })
                .catch(() => {
                    res.status(500).send("Fail !")
                })
        })
    }
}

module.exports = HV;