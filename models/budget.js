const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

//const User = require('../models/user');
const Category = require('./category');
const ReadAccess = require('../models/readAccess');

const Budget = sequelize.define(
    'Budget',
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

//Budget.belongsTo(User);
Budget.hasMany(Category);
Budget.hasMany(ReadAccess);

module.exports = Budget
