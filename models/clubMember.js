const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const User = require('../models/user');
const BudgetEntry = require('../models/budgetEntry');

const ClubMember = sequelize.define(
    'ClubMember',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        permanentCode : {
            type: DataTypes.STRING,
        },
        isActive : {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    },
    {}
);

ClubMember.belongsTo(User);
ClubMember.belongsToMany(BudgetEntry);

module.exports = ClubMember
