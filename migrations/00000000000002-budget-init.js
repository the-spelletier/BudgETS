'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'Budgets',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          name: {
              type: Sequelize.STRING,
              unique: true,
              allowNull: false,
              unique: 'compositeUnique'
          },
          userId: {
              type: Sequelize.UUID,
              allowNull: false,
              unique: 'compositeUnique',
              references: {
                  model: 'Users',
                  key: 'id'
              },
              onDelete: 'RESTRICT'
          },
          startDate: {
              type: Sequelize.DATE,
              allowNull: false
          },
          endDate: {
              type: Sequelize.DATE,
              allowNull: false
          },
          isActive: {
              type: Sequelize.BOOLEAN,
              defaultValue: false
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
    queryInterface.dropTable('Budgets')
  }
};
