/**
 * Created with <3 by drouar_b
 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('cities', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        name: DataTypes.STRING(64),
        db_url: DataTypes.STRING(256),
        db_user: DataTypes.STRING(64),
        db_pass: DataTypes.STRING(32),
        aws_key: DataTypes.STRING(32),
        aws_secret: DataTypes.STRING(64)
    }, { timestamps: false });
};