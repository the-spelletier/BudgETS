const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

//const User = require('../models/user');
//const Entry = require('./entry');

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

//ClubMember.belongsTo(User);
//ClubMember.belongsToMany(Entry);

module.exports = ClubMember
