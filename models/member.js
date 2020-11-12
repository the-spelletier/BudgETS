'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Member extends Model {
        static associate(models) {
            // define association here
            Member.belongsTo(models.User, {
                foreignKey: 'userId',
                onDelete: 'RESTRICT'
            });
        }
    };

    Member.init({
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        sms: {
            type: DataTypes.STRING,
            allowNull: true
        },
        active : {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false
        },
    }, {
        sequelize,
        modelName: 'Member',
    });
    return Member;
};