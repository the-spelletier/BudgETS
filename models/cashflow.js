'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cashflow extends Model {
        static associate(models) {
            // define association here
            Cashflow.belongsTo(models.Category, {
                foreignKey: 'categoryId'
            });
        }
    };

    Cashflow.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'compositeUnique'
        },
        year: {
            type: DataTypes.INTEGER(4),
            allowNull: false,
            unique: 'compositeUnique'
        },
        month: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            unique: 'compositeUnique'
        },
        estimate: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: '0.00',
        }
    }, {
        sequelize,
        modelName: 'Cashflow',
    });
    return Cashflow;
};