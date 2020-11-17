'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            // define association here
            User.hasMany(models.Budget, {
                foreignKey: 'userId'
            });
            User.belongsTo(models.Budget, {
                as: 'activeBudget',
                foreignKey: 'activeBudgetId',
                constraints: false
            });
            User.belongsToMany(models.Budget, {
                through: models.Access,
                foreignKey: 'userId',
            });
        }
    };

    User.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attemptFailed : {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        isBlocked : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isAdmin : {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        activeBudgetId : {
            type: DataTypes.UUID,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};