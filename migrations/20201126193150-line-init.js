'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'Lines',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          name: {
              type: Sequelize.STRING,
              unique: 'compositeUnique'
          },
          description: {
              type: Sequelize.STRING
          },
          orderNumber: {
              type: Sequelize.INTEGER,
              allowNull: false,
              defaultValue: '99'
          },
          categoryId: {
              type: Sequelize.UUID,
              allowNull: false,
              unique: 'compositeUnique',
              references: {
                  model: 'Categories',
                  key: 'id'
              }
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
    queryInterface.dropTable('Lines')
  }
};
