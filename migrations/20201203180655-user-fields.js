'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'Users', 
        'fullname',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', 
        'email', 
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      ),
      queryInterface.addColumn(
        'Users', 
        'deleted', 
        {
          type: Sequelize.BOOLEAN,
          allowNull: true
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.removeColumn('Users', 'fullname');
    queryInterface.removeColumn('Users', 'email');
    queryInterface.removeColumn('Users', 'deleted');
  }
};
