const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

//const User = require('../models/user');
//const Budget = require('../models/budget');

const ReadAccess = sequelize.define(
    'ReadAccess',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
    },
    {}
);

//ReadAccess.belongsTo(User);
//ReadAccess.belongsTo(Budget);

module.exports = ReadAccess
