'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Entry extends Model {
        static associate(models) {
            // define association here
            Entry.belongsTo(models.Line, {
                foreignKey: 'lineId',
                onDelete: 'RESTRICT'
            });
            Entry.belongsTo(models.EntryStatus, {
                foreignKey: 'entryStatusId',
                onDelete: 'RESTRICT'
            });
            Entry.belongsTo(models.Receipt, {
                foreignKey: 'receiptId',
                onDelete: 'RESTRICT'
            });
        }
    };

    Entry.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        lineId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        entryStatusId: {
            type: DataTypes.UUID,
            allowNull: false
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
            allowNull: false,
            validate: {
                isIn: [['revenue', 'expense']]
            }
        },
        receiptId: {
            type: DataTypes.UUID,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Entry',
    });
    return Entry;
};