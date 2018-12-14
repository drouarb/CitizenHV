/**
 * Created with <3 by drouar_b
 */

const Promise = require('bluebird');
const debug = require('debug')('VMController');
const arp = require('node-arp');
const sql = require('../sql');
const config = require('../config');

Promise.promisifyAll(arp);

class VMController {
    static getIP(req) {
        let ip = req.connection.remoteAddress;
        if (ip.substr(0, 7) === "::ffff:") {
            ip = ip.substr(7)
        }
        return ip;
    }

    static resolveVM(ip) {
        return sql.vms.findOne({
            attributes: ['cityId'],
            where: {
                ip: ip,
            }
        })
            .then((vm) => {
                if (!vm) {
                    return arp.getMACAsync(ip)
                        .then((mac) => {
                            return sql.vms.update(
                                {
                                    ip: ip
                                },
                                {
                                    where: {
                                        mac: mac
                                    }
                                })
                        })
                        .then(() => {
                            return sql.vms.findOne({
                                attributes: ['cityId'],
                                where: {
                                    ip: ip,
                                }
                            })
                        })
                        .then((vm) => {
                            return vm.dataValues.cityId
                        })
                } else {
                    return vm.dataValues.cityId;
                }
            })
    }

    static getConfig(req, res) {
        VMController.resolveVM(VMController.getIP(req))
            .then((cityId) => {
                return sql.vms.update({
                        status: 'building'
                    }, {
                        where: {
                            cityId: cityId
                        }
                    }
                ).then(() => {
                    return cityId
                });
            })
            .then((cityId) => {
                return sql.cities.findOne({
                    where: {
                        id: cityId
                    }
                });
            })
            .then((city) => {
                res.send(JSON.stringify({
                    api_url: config.api_url,
                    front_url: config.front_url,
                    front_branch: "master",
                    db_url: city.dataValues.db_url,
                    db_user: city.dataValues.db_user,
                    db_pass: city.dataValues.db_pass,
                    aws_key: city.dataValues.aws_key,
                    aws_secret: city.dataValues.aws_secret,
                }));
            });
    }

    static getFrontConfig(req, res) {
        VMController.resolveVM(VMController.getIP(req))
            .then((cityId) => {
                return sql.domains.findOne({
                    attributes: ['domain'],
                    where: {
                        cityId: cityId,
                        type: 9000
                    }
                })
            })
            .then((city) => {
                if (!city)
                    res.json({
                        "EndPointUrl": "https://citizen.navispeed.eu/api",
                        "OAuthEndPointUrl": " https://oauth.citizen.navispeed.eu/oauth",
                        "SignUpEndPointUrl": " https://oauth.citizen.navispeed.eu"
                    });
                else {
                    let frontConfig = {
                        "EndPointUrl": "http://" + city.dataValues.domain + ":3000/api",
                        "OAuthEndPointUrl": " https://oauth.citizen.navispeed.eu/oauth",
                        "SignUpEndPointUrl": " https://oauth.citizen.navispeed.eu"
                    };
                    console.log(frontConfig);
                    res.json(frontConfig);
                }
            });
    }

    static deploymentDone(req, res) {
        VMController.resolveVM(VMController.getIP(req))
            .then((cityId) => {
                return sql.vms.update({
                    status: 'running'
                }, {
                    where: {
                        cityId: cityId
                    }
                })
            })
            .then(() => {
                res.send('OK');
            });
    }
}

module.exports = VMController;