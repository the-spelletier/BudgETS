'use strict';
const settings = require('../config/testsConfig');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    let budgets = []
    let nbBudget = 0;

    // Add test budgets per user
    if (process.env.NODE_ENV == 'test') {
        for (let i = 1; i <= settings.NB_TEST_USERS; ++i) {
            for (let j = 1; j <= settings.NB_TEST_BUDGET_PER_USER; ++j) {
                nbBudget++;
                const active = (j == 1);
                budgets.push({
                    id: nbBudget,
                    name: 'budgetTest' + ("00" + i).slice(-3) + ("0" + j).slice(-2),
                    userId: i,
                    startDate: new Date(2020 - j + 1, 0, 1), // Months are indexed at 0, Days are indexed at 1
                    endDate: new Date(2020 - j + 1, 11, 31),
                    isActive: active
                });
            }
        }
    }

    // Add real budgets
    budgets.push({
        id: nbBudget + 1,
        name: '2019-2020',
        userId: 10,
        startDate: new Date(2019, 0, 1), // Months are indexed at 0, Days are indexed at 1
        endDate: new Date(2019, 11, 31),
        isActive: false
    });
    budgets.push({
        id: nbBudget + 2,
        name: '2020-2021',
        userId: 10,
        startDate: new Date(2020, 0, 1), // Months are indexed at 0, Days are indexed at 1
        endDate: new Date(2020, 11, 31),
        isActive: true
    });

    return queryInterface.bulkInsert('Budgets', budgets, {});
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
