const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const SessionLog = sequelize.define(
    'SessionLog',
    {
        loginSucceeded: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {}
);

module.exports = SessionLog