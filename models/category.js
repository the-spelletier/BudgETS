const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

//const Budget = require('./budget');
const Line = require('./line');

const Category = sequelize.define(
    'Category',
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

//Category.belongsTo(Budget);
Category.hasMany(Line);

module.exports = Category
