'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            // define association here
            Category.belongsTo(models.Budget, {
                foreignKey: 'budgetId',
                onDelete: 'CASCADE'
            });
            Category.hasMany(models.Entry, {
                foreignKey: 'categoryId'
            });
        }
    };

    Category.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'compositeUnique'
        },
        budgetId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('revenue', 'expense'),
            allowNull: false,
            unique: 'compositeUnique',
            validate: {
                isIn: [['revenue', 'expense']]
            }
        }
    }, {
        sequelize,
        modelName: 'Category',
    });
    return Category;
};