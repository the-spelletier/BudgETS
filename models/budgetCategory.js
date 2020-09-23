const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const Budget = require('../models/budget');
const BudgetLine = require('../models/budgetLine');

const BudgetCategory = sequelize.define(
    'BudgetCategory',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
    },
    {}
);

BudgetCategory.belongsTo(Budget);
BudgetCategory.hasMany(BudgetLine);

module.exports = BudgetCategory
