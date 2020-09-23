const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

//const Line = require('./line');
const ClubMember = require('./clubMember');
const Receipt = require('./receipt');
const EntryStatus = require('./entryStatus');

const Entry = sequelize.define(
    'Entry',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        amount: {
            type: DataTypes.DECIMAL(10,2),
        },
        date: {
            type: DataTypes.DATE,
        },
        description: {
            type: DataTypes.STRING
        },
        isRevenue : {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    },
    {}
);

//Entry.belongsTo(Line);
Entry.hasOne(ClubMember);
Entry.hasOne(Receipt);
Entry.hasOne(EntryStatus);

module.exports = Entry
