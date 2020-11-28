'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'Accesses',
        {
          budgetId: {
            type: Sequelize.UUID,
            allowNull: false,
              references: {
                model: 'Budgets',
                key: 'id'
              }
          },
          userId: {
              type: Sequelize.UUID,
              allowNull: false,
              references: {
                model: 'Users',
                key: 'id'
              },
              onDelete: 'RESTRICT'
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
    queryInterface.dropTable('Accesses')
  }
};
