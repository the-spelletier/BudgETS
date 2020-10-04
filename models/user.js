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
                foreignKey: 'userId',
                onDelete: 'RESTRICT'
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
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};