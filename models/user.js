const {Sequelize, DataTypes} = require('sequelize');
const sequelize = require('../db');

const Tokens = require('../models/token');
const SessionLog = require('../models/sessionLogs');

const User = sequelize.define(
    'User',
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
        }
    },
    {}
);

User.hasOne(SessionLog);
User.hasOne(Token);

module.exports = User
