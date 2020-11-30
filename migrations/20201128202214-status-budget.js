'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'EntryStatuses', // table name
        'budgetId', // new field name
        {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
              model: 'Budgets',
              key: 'id'
          },
          onDelete: 'RESTRICT'
        },
      ),
      queryInterface.addColumn(
        'EntryStatuses', // table name
        'deleted', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        },
      ),
      queryInterface.addColumn(
        'EntryStatuses', // table name
        'notify', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('EntryStatuses', 'budgetId');
    queryInterface.removeColumn('EntryStatuses', 'deleted');
    queryInterface.removeColumn('EntryStatuses', 'notify');
  }
};
