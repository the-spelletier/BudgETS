'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'Cashflows',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          categoryId: {
              type: Sequelize.UUID,
              allowNull: false,
              unique: 'compositeUnique',
              references: {
                  model: 'Categories',
                  key: 'id'
              },
              onDelete: 'RESTRICT'
          },
          year: {
              type: Sequelize.INTEGER(4),
              allowNull: false,
              unique: 'compositeUnique'
          },
          month: {
              type: Sequelize.INTEGER(2),
              allowNull: false,
              unique: 'compositeUnique'
          },
          estimate: {
              type: Sequelize.DECIMAL(10,2),
              allowNull: false,
              defaultValue: '0.00',
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
    queryInterface.dropTable('Cashflows')
  }
};
