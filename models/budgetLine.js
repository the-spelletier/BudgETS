const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const BudgetCategory = require('../models/budgetCategory');
const BudgetEntry = require('../models/budgetEntry');

const BudgetLine = sequelize.define(
    'BudgetLine',
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
        expenseEstimate: {
            type: DataTypes.DECIMAL(10,2),
        },
    },
    {}
);

BudgetLine.belongsTo(BudgetCategory);
BudgetLine.hasMany(BudgetEntry);

module.exports = BudgetLine
