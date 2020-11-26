'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let listItems = []
    
    if (process.env.NODE_ENV == 'test') {
        // User 001 has access to every budget
        for (let i = 1; i <= settings.NB_TEST_USERS * settings.NB_TEST_BUDGET_PER_USER; ++i) {
            listItems.push({
                budgetId: i,
                userId: 1
            });
        }

        // User 010 has access to budget 01 (Test 121006)
        listItems.push({
            budgetId: 1,
            userId: 10
        });

        // Budget 009 (user003) has multiple user accesses
        for (let i = 10; i <= settings.NB_TEST_USERS + settings.NB_TEST_DUMMY_USERS; ++i) {
            listItems.push({
                budgetId: 9,
                userId: i
            });
        }

        // Budget 009 (user003) has no access for user009 (Test 123008)
    }

    if (listItems.length > 0) {
        return queryInterface.bulkInsert('Accesses', listItems, {});
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
