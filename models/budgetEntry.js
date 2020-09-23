const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const BudgetLine = require('../models/budgetLine');
const ClubMember = require('../models/clubMember');
const Receipt = require('../models/receipt');
const EntryStatus = require('../models/entryStatus');

const BudgetEntry = sequelize.define(
    'BudgetEntry',
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
        memberName: {
            type: DataTypes.STRING
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

BudgetEntry.belongsTo(BudgetLine);
BudgetEntry.hasOne(ClubMember);
BudgetEntry.hasOne(Receipt);
BudgetEntry.hasOne(EntryStatus);

module.exports = BudgetEntry
