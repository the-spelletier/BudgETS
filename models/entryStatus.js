'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EntryStatus extends Model {
        static associate(models) {
            // define association here
            EntryStatus.hasMany(models.Entry, {
                foreignKey: 'entryStatusId'
            });
        }
    };

    EntryStatus.init({
        name: {
            type: DataTypes.STRING
        },
        position: {
            type: DataTypes.INTEGER
        }
    }, {
        sequelize,
        modelName: 'EntryStatus',
    });
    return EntryStatus;
};