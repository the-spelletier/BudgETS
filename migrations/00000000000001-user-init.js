'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'Users',
        {
          id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true
          },
          username: {
              type: Sequelize.STRING,
              allowNull: false,
              unique: true
          },
          password: {
              type: Sequelize.STRING,
              allowNull: false
          },
          attemptFailed : {
              type: Sequelize.INTEGER,
              defaultValue: 0
          },
          isBlocked : {
              type: Sequelize.BOOLEAN,
              defaultValue: false
          },
          isAdmin : {
              type: Sequelize.BOOLEAN,
              defaultValue: false
          },
          activeBudgetId : {
              type: Sequelize.UUID,
              allowNull: true,
              references: {
                  model: 'Budgets',
                  key: 'id'
              }
          }
        },
        {
          engine: 'MYISAM',                     // default: 'InnoDB'
          charset: 'latin1'                     // default: null
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('Users')
  }
};
