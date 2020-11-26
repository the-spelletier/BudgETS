'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'Categories',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'compositeUnique'
        },
        orderNumber: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: '99'
        },
        budgetId: {
            type: Sequelize.UUID,
            allowNull: false,
            unique: 'compositeUnique',
              references: {
                  model: 'Budgets',
                  key: 'id'
              }
        },
        type: {
            type: Sequelize.ENUM('revenue', 'expense'),
            allowNull: false,
            unique: 'compositeUnique',
            validate: {
                isIn: [['revenue', 'expense']]
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
    queryInterface.dropTable('Categories')
  }
};
