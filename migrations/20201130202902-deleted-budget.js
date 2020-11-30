'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.addColumn(
        'Budgets', // table name
        'deleted', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
      );
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Budgets', 'deleted');
  }
};
