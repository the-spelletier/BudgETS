'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'Members',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          name: {
              type: Sequelize.STRING,
              allowNull: false
          },
          code: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true
          },
          email: {
              type: Sequelize.STRING,
              allowNull: true
          },
          sms: {
              type: Sequelize.STRING,
              allowNull: true
          },
          notify : {
              type: Sequelize.BOOLEAN,
              defaultValue: false
          },
          active : {
              type: Sequelize.BOOLEAN,
              defaultValue: true
          },
          userId: {
              type: Sequelize.UUID,
              allowNull: false,
              references: {
                  model: 'Users',
                  key: 'id'
              },
              onDelete: 'RESTRICT'
          },
          deleted : {
              type: Sequelize.BOOLEAN,
              allowNull: true,
              defaultValue: false
          },
        },
        {
          engine: 'MYISAM',                     // default: 'InnoDB'
          charset: 'latin1'                     // default: null
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Members')
  }
};
