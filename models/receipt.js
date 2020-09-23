const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

//const Entry = require('./entry');

const Receipt = sequelize.define(
    'Receipt',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
    },
    {}
);

//Receipt.belongsTo(Entry);

module.exports = Receipt
