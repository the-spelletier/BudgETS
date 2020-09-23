const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const Tokens = require('../models/token');
const SessionLog = require('../models/sessionLogs');
const ClubMember = require('../models/clubMember');
const Budget = require('../models/budget');
const ReadAccess = require('../models/readAccess');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        clubName : {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING
        },
        attemptFailed : {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isBlocked : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isAdmin : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    },
    {}
);

User.hasOne(SessionLog);
User.hasOne(Tokens);

User.hasMany(ClubMember);
User.hasMany(Budget);
User.hasMany(ReadAccess);

module.exports = User
