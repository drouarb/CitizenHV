/**
 * Created with <3 by drouar_b
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('vms', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        ip: {
            type: 'inet'
        },
        mac: {
            type: 'macaddr',
        },
        status: {
            type: DataTypes.ENUM,
            values: [
                'started',
                'building',
                'running'
            ]
        }
    }, { timestamps: false });
};