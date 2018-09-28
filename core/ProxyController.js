/**
 * Created with <3 by drouar_b
 */

const sql = require('../sql');
const proxy = require('http-proxy').createProxyServer({});
const Op = sql.sequelize.Op;

class ProxyController {
    static hostnameof(req) {
        let host = req.headers.host;

        if (!host) {
            return
        }

        let offset = host[0] === '['
            ? host.indexOf(']') + 1
            : 0;
        let index = host.indexOf(':', offset);

        return index !== -1
            ? host.substring(0, index)
            : host
    }

    static proxyRequest(req, res) {
        let port;
        let host = ProxyController.hostnameof(req);

        sql.domains.findOne({
            where: {domain: host},
            attributes: ['cityId', 'type']
        })
            .then((city) => {
                if (!city)
                    res.sendStatus(404);
                else {
                    port = city.dataValues.type;
                    return sql.vms.findAll({
                        attributes: ['ip'],
                        where: {
                            [Op.and]: [
                                {cityId: city.dataValues.cityId},
                                {status: 'running'},
                            ]
                        }

                    });
                }
            })
            .then((vms) => {
                if (vms.length === 0) {
                    res.sendStatus(502);
                } else {
                    let vm = vms[Math.floor(Math.random()*vms.length)];
                    try {
                        proxy.web(req, res, { target: 'http://'+ vm.dataValues.ip + ':' + port });
                    } catch (e) {
                        res.sendStatus(502)
                    }
                }
            });
    }
}

module.exports = ProxyController;