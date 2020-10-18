'use strict';
const bcrypt = require('bcrypt');
const config = require('../config/jsonConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('Users', [{
        id: 1,
        username: 'budgets_test01',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: true
      },{
        id: 2,
        username: 'budgets_test02',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: false
      },{
        id: 3,
        username: 'budgets_test03',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: false
      },{
        id: 4,
        username: 'budgets_test04',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: false
      },{
        id: 5,
        username: 'budgets_test05',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: false
      },{
        id: 6,
        username: 'budgets_test06',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: false
      },{
        id: 7,
        username: 'budgets_test07',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: false
      },{
        id: 8,
        username: 'budgets_test08',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: false
      },{
        id: 9,
        username: 'budgets_test09',
        password: bcrypt.hashSync("test123", config.saltRounds),
        isAdmin: false
      },{
        id: 10,
        username: 'budgets_admin',
        password: bcrypt.hashSync("admin_2020", config.saltRounds),
        isAdmin: true
      }], {});
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
