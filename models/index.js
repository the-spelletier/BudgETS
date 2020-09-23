const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Budget = sequelize.define(
    'Budget',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        },
        isActive : {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
    },
    {}
);

const Category = sequelize.define(
    'Category',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('revenues', 'expenses'),
            allowNull: false
        }
    },
    {}
);

const Entry = sequelize.define(
    'Entry',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        amount: {
            type: DataTypes.DECIMAL(10,2),
        },
        date: {
            type: DataTypes.DATE,
        },
        member: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        type: {
            type: DataTypes.ENUM('revenue', 'expense'),
            allowNull: false
        }
    },
    {}
);

const EntryStatus = sequelize.define(
    'EntryStatus',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        position: {
            type: DataTypes.INTEGER
        },
    },
    {}
);

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

const Receipt = sequelize.define(
    'Receipt',
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
    },
    {}
);

const SessionLog = sequelize.define(
    'SessionLog',
    {
        loginSucceeded: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {}
);

const Token = sequelize.define(
    'Token',
    {
        value: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // Time-to-live
        ttl: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {}
);

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
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

//Budget
Budget.belongsTo(User);
Budget.hasMany(Category);
Budget.hasMany(ReadAccess);

//Category
Category.belongsTo(Budget);
Category.hasMany(Line);

//Entry
Entry.belongsTo(Line);
Entry.hasOne(Receipt);
Entry.hasOne(EntryStatus);

//Line
Line.belongsTo(Category);
Line.hasMany(Entry);

//Receipt
Receipt.belongsTo(Entry);

//ReadAccess
ReadAccess.belongsTo(User);
ReadAccess.belongsTo(Budget)

//User
User.hasOne(SessionLog);
User.hasOne(Token);

User.hasMany(Budget);
User.hasMany(ReadAccess);

module.exports = {
    Budget,
    Category,
    Entry,
    EntryStatus,
    Line,
    ReadAccess,
    Receipt,
    SessionLog,
    Token,
    User
};