'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {
            // define association here
            Category.belongsTo(models.Budget, {
                foreignKey: 'budgetId'
            });
            Category.hasMany(models.Line, {
                foreignKey: 'categoryId'
            });
        }
    };

    Category.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'compositeUnique'
        },
        budgetId: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: 'compositeUnique'
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