const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const Token = sequelize.define(
    'Token',
    {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Time-to-live
        ttl: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {}
);

module.exports = Token