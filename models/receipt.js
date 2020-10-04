'use strict';
const {
  Model,
  Sequelize
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Receipt extends Model {
        static associate(models) {
            // define association here
            Receipt.hasOne(models.Entry, {
                foreignKey: 'receiptId'
            });
        }
    };

    Receipt.init({
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
    }, {
        sequelize,
        modelName: 'Receipt',
    });
    return Receipt;
};