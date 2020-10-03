'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Entry extends Model {
        static associate(models) {
            // define association here
            Entry.belongsTo(models.EntryStatus, {
                foreignKey: 'entryStatusId',
                onDelete: 'CASCADE'
            });
            Entry.belongsTo(models.Line, {
                foreignKey: 'lineId',
                onDelete: 'CASCADE'
            });
        }
    };

    Entry.init({
        lineId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        categentryStatusIdoryId: {
            type: DataTypes.INTEGER,
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
        }
    }, {
        sequelize,
        modelName: 'Entry',
    });
    return Entry;
};