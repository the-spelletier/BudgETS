const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const BudgetEntry = require('../models/budgetEntry');

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

Receipt.belongsTo(BudgetEntry);

module.exports = Receipt
