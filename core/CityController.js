/**
 * Created with <3 by drouar_b
 */

const Promise = require('bluebird');
const xml2js = Promise.promisifyAll(require('xml2js'));
const uuidv4 = require('uuid/v4');
const randomMac = require('random-mac');
const HVUtils = require("../utils/HVUtils");
const sql = require('../sql');
const config = require('../config');

class CityController {
    static listCities(req, res) {
        sql.cities.findAll({
            attributes: ['name'],
        })
            .map((city) => {
                return city.dataValues.name
            })
            .then((cities) => {
                res.json(cities);
            });
    }

    static cityInfo(req, res) {
        sql.cities.findOne({
            where: {name: req.params.city},
            raw: true
        })
            .then((city) => {
                if (!city)
                    res.sendStatus(404);
                else
                    res.json(city);
            })
    }

    static listVms(req, res) {
        sql.cities.findOne({
            attributes: ['id'],
            where: {name: req.params.city}
        })
            .then((city) => {
                if (!city) {
                    res.sendStatus(404);
                    return Promise.reject('City not found');
                }

                return sql.vms.findAll({
                    attributes: ['uuid'],
                    where: {cityId: city.dataValues.id}
                })
            })
            .map((vm) => {
                return 'citizen-' + req.params.city + '-' + vm.dataValues.uuid;
            })
            .then((vms) => {
                res.json(vms);
            });
    }

    static spawn(req, res) {
        let cityId;
        let uuid;
        let mac;

        sql.cities.findOne({
            attributes: ['id'],
            where: {name: req.params.city}
        })
            .then((city) => {
                if (!city) {
                    res.sendStatus(404);
                    return Promise.reject('City not found');
                }

                cityId = city.dataValues.id;
                return HVUtils.getDomainFromName(config.templateName)
            })
            .then((domain) => {
                return domain.toXmlAsync()
            })
            .then(xml2js.parseStringAsync)
            .then((xml) => {
                uuid = uuidv4();
                xml.domain.name[0] = "citizen-" + req.params.city + "-" + uuid;
                xml.domain.uuid[0] = uuid;
                xml.domain.devices[0].disk[0].readonly = [''];

                mac = randomMac();
                xml.domain.devices[0].interface[0].mac[0]['$'].address = mac;
                return xml
            })
            .then((obj) => {
                let builder = new xml2js.Builder();
                return builder.buildObject(obj);
            })
            .then(async (xml) => {
                let hv = await HVUtils.getHV();
                return hv.createDomainAsync(xml);
            })
            .then(() => {
                return sql.vms.build({
                    uuid: uuid,
                    mac: mac,
                    status: 'started',
                    cityId: cityId
                }).save();
            })
            .then(() => {
                res.send('OK');
            })
    }
}

module.exports = CityController;