'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.createTable(
        'Entries',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
          },
          lineId: {
              type: Sequelize.UUID,
              allowNull: false,
              references: {
                  model: 'Lines',
                  key: 'id'
              }
          },
          entryStatusId: {
              type: Sequelize.UUID,
              allowNull: true,
              references: {
                  model: 'EntryStatuses',
                  key: 'id'
              }
          },
          memberId: {
              type: Sequelize.UUID,
              allowNull: true,
              references: {
                  model: 'Members',
                  key: 'id'
              }
          },
          amount: {
              type: Sequelize.DECIMAL(10,2),
              allowNull: false,
              defaultValue: '0.00',
          },
          date: {
              type: Sequelize.DATE,
          },
          description: {
              type: Sequelize.STRING
          },
          receiptCode: {
              type: Sequelize.STRING
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
    queryInterface.dropTable('Entries')
  }
};
