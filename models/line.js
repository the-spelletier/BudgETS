'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Line extends Model {
        static associate(models) {
            // define association here
            Line.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                onDelete: 'CASCADE'
            });
            Line.hasMany(models.Entry, {
                foreignKey: 'lineId'
            });
        }
    };

    Line.init({
        name: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.STRING
        },
        categoryId: {
            type: DataTypes.INTEGER,
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