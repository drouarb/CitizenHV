/**
 * Created with <3 by drouar_b
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('domains', {
        domain: {
            type: DataTypes.TEXT,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        type: DataTypes.INTEGER
    }, { timestamps: false });
};