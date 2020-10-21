'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let users = []
    let nbUsers = 0;

    // Add test users
    if (process.env.NODE_ENV == 'test') {
        for (let i = 1; i <= settings.NB_TEST_USERS; ++i) {
            nbUsers++;
            users.push({
                id: nbUsers,
                username: 'budgets_test' + ("00" + i).slice(-3),
                password: bcrypt.hashSync("test123", config.saltRounds),
                isAdmin: (nbUsers == 1) ? true : false
            });
        }
    } else if (process.env.NODE_ENV == 'development') {
      // Add real users
      users.push({
          id: nbUsers + 1,
          username: 'budgets_admin',
          password: bcrypt.hashSync("admin_2020", config.saltRounds),
          isAdmin: true
      });
    }

    if (users.length > 0) {
        return queryInterface.bulkInsert('Users', users, {});
    }

    return;
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
