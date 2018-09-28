/**
 * Created with <3 by drouar_b
 */

const Sequelize = require('sequelize');
const config = require('../config');
const debug = require('debug')('sequelize');

config.sql.logging = debug;

let db = {
    sequelize: new Sequelize(
        config.sql.database,
        config.sql.username,
        config.sql.password,
        config.sql
    )
};

db.cities = db.sequelize.import('./cities');
db.domains = db.sequelize.import('./domains');
db.vms = db.sequelize.import('./vms');

db.domains.belongsTo(db.cities);
db.vms.belongsTo(db.cities);
db.cities.hasMany(db.domains);

db.sequelize.sync();

module.exports = db;