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
            Entry.belongsTo(models.Member, {
                foreignKey: 'memberId',
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
            allowNull: true
        },
        memberId: {
            type: DataTypes.UUID,
            allowNull: true
        },
        amount: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: '0.00',
        },
        date: {
            type: DataTypes.DATE,
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
        receiptCode: {
            type: DataTypes.STRING
        }
    }, {
        sequelize,
        modelName: 'Entry',
    });
    return Entry;
};