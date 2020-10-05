'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Budget extends Model {
        static associate(models) {
            // define association here
            Budget.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'CASCADE'
            });
            Budget.hasMany(models.Category, {
                foreignKey: {unique: 'compositeUnique'}
            });
        }
    };

    Budget.init({
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
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