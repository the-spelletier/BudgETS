const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

//const Entry = require('./entry');

const EntryStatus = sequelize.define(
    'EntryStatus',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        position: {
            type: DataTypes.INTEGER
        },
    },
    {}
);

//EntryStatus.belongsToMany(Entry);

module.exports = EntryStatus
