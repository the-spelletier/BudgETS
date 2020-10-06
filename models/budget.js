'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Budget extends Model {
        static associate(models) {
            // define association here
            Budget.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'RESTRICT'
            });
            Budget.hasMany(models.Category, {
                foreignKey: 'budgetId',
                onDelete: 'RESTRICT'
            });
        }
    };

    Budget.init({
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
        userId: {
            type: DataTypes.UUID,
            allowNull: false
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
        }
    }, {
        sequelize,
        modelName: 'Budget',
    });
    return Budget;
};