const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../db');

const Budget = sequelize.define(
    'budget',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
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
            defaultValue: false
        },
    },
    {}
);

const Category = sequelize.define(
    'category',
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
    'entry',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        amount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: '0.00',
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
    'entryStatus',
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
    'line',
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
            allowNull: false,
            defaultValue: '0.00',
        },
    },
    {}
);

const ReadAccess = sequelize.define(
    'readAccess',
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
    'receipt',
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
    'sessionLog',
    {
        loginSucceeded: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        }
    },
    {}
);

const Token = sequelize.define(
    'token',
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
    'user',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
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
Category.hasMany(Entry);

//Entry
Entry.belongsTo(Line);
Entry.belongsTo(Category);
Entry.hasOne(Receipt);
Entry.hasOne(EntryStatus);

//Line
Line.belongsTo(Category);
Line.hasMany(Entry);

//Receipt
Receipt.belongsTo(Entry);

//EntryStatus
EntryStatus.belongsTo(Entry);

//ReadAccess
ReadAccess.belongsTo(User);
ReadAccess.belongsTo(Budget)

//SessionLog
SessionLog.belongsTo(User);

//Token
Token.belongsTo(User);

//User
User.hasMany(SessionLog);
User.hasMany(Token);

User.hasMany(Budget);
User.hasMany(ReadAccess);

// Create tables if not exist
User.sync().then(() => {
    SessionLog.sync();
    Budget.sync().then(() => {
        ReadAccess.sync();
        Category.sync().then(() => {
            Line.sync().then(() => {
                Entry.sync().then(() => {
                    Receipt.sync();
                    EntryStatus.sync();
                })
            })
        })
    })
});

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