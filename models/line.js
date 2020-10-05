'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Line extends Model {
        static associate(models) {
            // define association here
            Line.belongsTo(models.Category, {
                foreignKey: 'categoryId'
            });
            Line.hasMany(models.Entry, {
                foreignKey: 'lineId'
            });
        }
    };

    Line.init({
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
        categoryId: {
            type: DataTypes.UUID,
            allowNull: false
        },
        expenseEstimate: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
            defaultValue: '0.00',
        }
    }, {
        sequelize,
        modelName: 'Line',
    });
    return Line;
};