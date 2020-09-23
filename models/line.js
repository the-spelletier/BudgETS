const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

//const Category = require('./category');
const Entry = require('./entry');

const Line = sequelize.define(
    'Line',
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

//Line.belongsTo(Category);
Line.hasMany(Entry);

module.exports = Line
