'use strict';
const {
  Model,
  Sequelize
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
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
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