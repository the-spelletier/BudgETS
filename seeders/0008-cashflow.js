'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let listItems = []
    let nbItems = 0;
    
    if (process.env.NODE_ENV == 'test') {
        // Add test cashflows per budget
        for (let i = 1; i <= settings.NB_TEST_CASHFLOWS; ++i) {
            nbItems++;
            listItems.push({
                id: nbItems,
                categoryId: 1,
                year: 2020,
                month: i,
                estimate: -100 * nbItems
            });
        }

        for (let i = 1; i <= settings.NB_TEST_CASHFLOWS; ++i) {
            nbItems++;
            listItems.push({
                id: nbItems,
                categoryId: 2,
                year: 2020,
                month: i,
                estimate: 100 * nbItems
            });
        }

        for (let i = 1; i <= settings.NB_TEST_CASHFLOWS; ++i) {
            nbItems++;
            listItems.push({
                id: nbItems,
                categoryId: 17,
                year: 2020,
                month: i,
                estimate: -100 * nbItems
            });
        }
    }

    if (listItems.length > 0) {
        return queryInterface.bulkInsert('Cashflows', listItems, {});
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
